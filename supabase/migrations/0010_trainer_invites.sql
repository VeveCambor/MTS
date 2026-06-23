-- =============================================================
-- 0010_trainer_invites.sql
-- Pozvánky trenéra pro propojení se sportovcem (cvičencem)
-- =============================================================

create table public.trainer_invites (
  id uuid primary key default gen_random_uuid(),
  trainer_id uuid not null references public.profiles (id) on delete cascade,
  email text not null,
  code text not null unique,
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'cancelled', 'expired')),
  accepted_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '14 days')
);

create index trainer_invites_trainer_idx on public.trainer_invites (trainer_id);
create index trainer_invites_email_idx on public.trainer_invites (lower(email));

create unique index trainer_invites_pending_trainer_email_idx
  on public.trainer_invites (trainer_id, lower(email))
  where status = 'pending';

alter table public.trainer_invites enable row level security;

-- Trenér vidí své pozvánky; cvičenec vidí pozvánky na svůj e-mail
create policy "trainer_invites_select"
  on public.trainer_invites for select
  using (
    trainer_id = auth.uid()
    or lower(email) = lower((select p.email from public.profiles p where p.id = auth.uid()))
  );

-- -------------------------------------------------------------
-- Náhled pozvánky (veřejný — bez e-mailu)
-- -------------------------------------------------------------
create or replace function public.get_trainer_invite_preview(p_code text)
returns table (
  trainer_nick text,
  trainer_first_name text,
  trainer_last_name text,
  valid boolean
)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  select
    p.nick,
    p.first_name,
    p.last_name,
    (i.status = 'pending' and i.expires_at > now()) as valid
  from public.trainer_invites i
  join public.profiles p on p.id = i.trainer_id
  where i.code = upper(trim(p_code))
  limit 1;
end;
$$;

-- -------------------------------------------------------------
-- Seznam pozvánek (trenér = odeslané, cvičenec = příchozí)
-- -------------------------------------------------------------
create or replace function public.list_trainer_invites()
returns table (
  id uuid,
  code text,
  email text,
  status text,
  expires_at timestamptz,
  created_at timestamptz,
  trainer_id uuid,
  trainer_nick text,
  trainer_first_name text,
  trainer_last_name text
)
language sql
security definer
set search_path = public
stable
as $$
  select
    i.id,
    i.code,
    i.email,
    i.status,
    i.expires_at,
    i.created_at,
    i.trainer_id,
    p.nick,
    p.first_name,
    p.last_name
  from public.trainer_invites i
  join public.profiles p on p.id = i.trainer_id
  where i.status = 'pending'
    and i.expires_at > now()
    and (
      i.trainer_id = auth.uid()
      or lower(i.email) = lower((select pr.email from public.profiles pr where pr.id = auth.uid()))
    )
  order by i.created_at desc;
$$;

-- -------------------------------------------------------------
-- Vytvoření pozvánky (trenér)
-- -------------------------------------------------------------
create or replace function public.create_trainer_invite(p_email text)
returns public.trainer_invites
language plpgsql
security definer
set search_path = public
as $$
declare
  v_trainer_id uuid := auth.uid();
  v_role smallint;
  v_email text := lower(trim(p_email));
  v_code text;
  v_invite public.trainer_invites;
  v_existing uuid;
begin
  if v_email = '' or v_email !~ '^[^@]+@[^@]+\.[^@]+$' then
    raise exception 'Neplatný e-mail';
  end if;

  select role into v_role from public.profiles where id = v_trainer_id;
  if v_role not in (20, 21, 1000) then
    raise exception 'Pouze trenér může posílat pozvánky';
  end if;

  if lower((select email from public.profiles where id = v_trainer_id)) = v_email then
    raise exception 'Nemůžeš pozvat sám sebe';
  end if;

  if exists (
    select 1 from public.profiles
    where lower(email) = v_email and trainer_id = v_trainer_id
  ) then
    raise exception 'Tento sportovec je už tvůj cvičenec';
  end if;

  select id into v_existing
  from public.trainer_invites
  where trainer_id = v_trainer_id and lower(email) = v_email and status = 'pending'
  limit 1;

  if v_existing is not null then
    select * into v_invite from public.trainer_invites where id = v_existing;
    return v_invite;
  end if;

  v_code := upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));

  insert into public.trainer_invites (trainer_id, email, code)
  values (v_trainer_id, v_email, v_code)
  returning * into v_invite;

  return v_invite;
end;
$$;

-- -------------------------------------------------------------
-- Přijetí pozvánky (cvičenec)
-- -------------------------------------------------------------
create or replace function public.accept_trainer_invite(p_code text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_profile public.profiles;
  v_invite public.trainer_invites;
begin
  select * into v_invite
  from public.trainer_invites
  where code = upper(trim(p_code))
    and status = 'pending'
    and expires_at > now()
  for update;

  if v_invite.id is null then
    raise exception 'Pozvánka neexistuje, vypršela nebo už byla použita';
  end if;

  select * into v_profile from public.profiles where id = v_user_id for update;

  if lower(v_profile.email) <> lower(v_invite.email) then
    raise exception 'Pozvánka je pro jiný e-mail (%)', v_invite.email;
  end if;

  if v_profile.role not in (1, 2) then
    raise exception 'Pozvánku může přijmout pouze cvičenec';
  end if;

  if v_profile.trainer_id is not null and v_profile.trainer_id <> v_invite.trainer_id then
    raise exception 'Už máš přiřazeného jiného trenéra';
  end if;

  update public.profiles
  set trainer_id = v_invite.trainer_id
  where id = v_user_id;

  update public.trainer_invites
  set status = 'accepted', accepted_by = v_user_id
  where id = v_invite.id;

  update public.trainer_invites
  set status = 'cancelled'
  where lower(email) = lower(v_invite.email)
    and status = 'pending'
    and id <> v_invite.id;

  return v_invite.trainer_id;
end;
$$;

-- -------------------------------------------------------------
-- Zrušení pozvánky (trenér nebo cvičenec)
-- -------------------------------------------------------------
create or replace function public.cancel_trainer_invite(p_invite_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_invite public.trainer_invites;
  v_email text;
begin
  select * into v_invite
  from public.trainer_invites
  where id = p_invite_id and status = 'pending'
  for update;

  if v_invite.id is null then
    raise exception 'Pozvánku nelze zrušit';
  end if;

  select email into v_email from public.profiles where id = auth.uid();

  if v_invite.trainer_id <> auth.uid() and lower(v_invite.email) <> lower(v_email) then
    raise exception 'Nemáš oprávnění zrušit tuto pozvánku';
  end if;

  update public.trainer_invites set status = 'cancelled' where id = p_invite_id;
end;
$$;

grant execute on function public.get_trainer_invite_preview(text) to anon, authenticated;
grant execute on function public.list_trainer_invites() to authenticated;
grant execute on function public.create_trainer_invite(text) to authenticated;
grant execute on function public.accept_trainer_invite(text) to authenticated;
grant execute on function public.cancel_trainer_invite(uuid) to authenticated;
