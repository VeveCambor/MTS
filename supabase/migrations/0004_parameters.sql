-- =============================================================
-- 0004_parameters.sql
-- Typy parametrů, trenérské parametry, přiřazení k jednotkám,
-- aktuální a historické hodnoty cvičenců + RLS
-- =============================================================

-- Typy parametrů (globální katalog)
create table public.parameter_types (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text
);

alter table public.parameter_types enable row level security;

create policy "parameter_types_select_all"
  on public.parameter_types for select
  to authenticated using (true);

-- Trenérské parametry
create table public.trainer_parameters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id),
  activity_id uuid not null references public.activities (id),
  parameter_type_id uuid not null references public.parameter_types (id),
  name text not null,
  description text
);

create index trainer_parameters_user_activity_idx
  on public.trainer_parameters (user_id, activity_id);

alter table public.trainer_parameters enable row level security;

create policy "trainer_parameters_owner_all"
  on public.trainer_parameters for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Přiřazení parametru k tréninkové jednotce
create table public.activity_training_parameters_assign (
  id uuid primary key default gen_random_uuid(),
  activity_training_id uuid not null references public.activity_trainings (id) on delete cascade,
  trainer_parameter_id uuid not null references public.trainer_parameters (id),
  length_unit_id uuid references public.activity_training_param_units (id),
  value numeric,
  value_text text
);

create index atpa_training_idx
  on public.activity_training_parameters_assign (activity_training_id);

alter table public.activity_training_parameters_assign enable row level security;

create policy "atpa_owner_all"
  on public.activity_training_parameters_assign for all
  using (
    exists (
      select 1 from public.activity_trainings t
      where t.id = activity_training_id and t.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.activity_trainings t
      where t.id = activity_training_id and t.user_id = auth.uid()
    )
  );

-- Aktuální hodnoty parametrů cvičence
create table public.actual_user_parameters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id),
  trainer_id uuid not null references public.profiles (id),
  trainer_parameter_id uuid not null references public.trainer_parameters (id),
  value text,
  recorded_at timestamptz not null default now()
);

create index aup_user_idx on public.actual_user_parameters (user_id);

alter table public.actual_user_parameters enable row level security;

-- Trenér spravuje hodnoty svých cvičenců
create policy "aup_trainer_all"
  on public.actual_user_parameters for all
  using (trainer_id = auth.uid())
  with check (trainer_id = auth.uid());

-- Cvičenec vidí své hodnoty
create policy "aup_user_select"
  on public.actual_user_parameters for select
  using (user_id = auth.uid());

-- Historie hodnot
create table public.history_user_parameters (
  trainer_parameter_id uuid not null references public.trainer_parameters (id),
  user_id uuid not null references public.profiles (id),
  trainer_id uuid not null references public.profiles (id),
  date_time_from timestamptz not null,
  date_time_to timestamptz not null,
  value text,
  primary key (trainer_parameter_id, user_id, trainer_id, date_time_from, date_time_to)
);

alter table public.history_user_parameters enable row level security;

create policy "hup_trainer_all"
  on public.history_user_parameters for all
  using (trainer_id = auth.uid())
  with check (trainer_id = auth.uid());

create policy "hup_user_select"
  on public.history_user_parameters for select
  using (user_id = auth.uid());
