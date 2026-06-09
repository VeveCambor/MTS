-- =============================================================
-- 0001_profiles.sql
-- Profily uživatelů (rozšíření Supabase Auth) + auto-trigger + RLS
-- =============================================================

-- Sdílená funkce pro automatickou aktualizaci updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nick text not null unique,
  email text not null,
  first_name text,
  last_name text,
  role smallint not null default 0,
  trainer_id uuid references public.profiles (id),
  is_user_trainer boolean not null default false,
  date_of_birth date,
  avatar smallint,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_trainer_id_idx on public.profiles (trainer_id);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- -------------------------------------------------------------
-- Trigger: po vytvoření auth.users vytvoř odpovídající profil
-- -------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_nick text;
begin
  v_nick := coalesce(
    nullif(new.raw_user_meta_data ->> 'nick', ''),
    split_part(new.email, '@', 1)
  );

  -- zajisti unikátnost nicku
  if exists (select 1 from public.profiles where nick = v_nick) then
    v_nick := v_nick || '_' || substr(new.id::text, 1, 8);
  end if;

  insert into public.profiles (id, nick, email, first_name, last_name, role)
  values (
    new.id,
    v_nick,
    new.email,
    nullif(new.raw_user_meta_data ->> 'first_name', ''),
    nullif(new.raw_user_meta_data ->> 'last_name', ''),
    coalesce((new.raw_user_meta_data ->> 'role')::smallint, 0)
  );

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- -------------------------------------------------------------
-- RLS
-- -------------------------------------------------------------
alter table public.profiles enable row level security;

-- Uživatel vidí svůj profil; trenér vidí své cvičence
create policy "profiles_select_own_or_trainees"
  on public.profiles for select
  using (id = auth.uid() or trainer_id = auth.uid());

-- Uživatel může upravit svůj profil
create policy "profiles_update_own"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());
