-- =============================================================
-- 0003_activity_groups_trainings.sql
-- Skupiny tréninků, tréninkové jednotky, měrné jednotky,
-- oblíbené aktivity trenéra + RLS
-- =============================================================

-- Měrné jednotky (globální katalog)
create table public.activity_training_param_units (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text
);

alter table public.activity_training_param_units enable row level security;

create policy "param_units_select_all"
  on public.activity_training_param_units for select
  to authenticated using (true);

-- Skupiny tréninků (vlastník = trenér)
create table public.activity_groups (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references public.activities (id),
  user_id uuid not null references public.profiles (id),
  name text not null,
  description text
);

create index activity_groups_activity_user_idx
  on public.activity_groups (activity_id, user_id);

alter table public.activity_groups enable row level security;

create policy "activity_groups_owner_all"
  on public.activity_groups for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Tréninkové jednotky
create table public.activity_trainings (
  id uuid primary key default gen_random_uuid(),
  activity_group_id uuid not null references public.activity_groups (id) on delete cascade,
  user_id uuid not null references public.profiles (id),
  name text not null,
  description text
);

create index activity_trainings_group_idx on public.activity_trainings (activity_group_id);

alter table public.activity_trainings enable row level security;

create policy "activity_trainings_owner_all"
  on public.activity_trainings for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Oblíbené/povolené aktivity trenéra
create table public.trainer_activity_enable (
  user_id uuid not null references public.profiles (id),
  activity_id uuid not null references public.activities (id),
  primary key (user_id, activity_id)
);

alter table public.trainer_activity_enable enable row level security;

create policy "trainer_activity_enable_owner_all"
  on public.trainer_activity_enable for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
