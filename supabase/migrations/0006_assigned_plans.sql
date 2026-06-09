-- =============================================================
-- 0006_assigned_plans.sql
-- Přiřazené plány cvičencům + týdny + denní aktivity + RLS
-- =============================================================

create table public.training_plan_user_assigns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id),
  trainer_id uuid not null references public.profiles (id),
  name text not null,
  description text,
  cycle_length smallint not null,
  number_of_cycles smallint not null,
  enabled boolean not null default true,
  date_time_start timestamptz not null,
  source_template_id uuid references public.training_plans (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index tpua_user_idx on public.training_plan_user_assigns (user_id);
create index tpua_trainer_idx on public.training_plan_user_assigns (trainer_id);

create trigger tpua_set_updated_at
  before update on public.training_plan_user_assigns
  for each row execute function public.set_updated_at();

alter table public.training_plan_user_assigns enable row level security;

create policy "tpua_trainer_all"
  on public.training_plan_user_assigns for all
  using (trainer_id = auth.uid())
  with check (trainer_id = auth.uid());

create policy "tpua_trainee_select"
  on public.training_plan_user_assigns for select
  using (user_id = auth.uid());

-- Týdny přiřazeného plánu
create table public.training_plan_user_assign_week_definitions (
  id uuid primary key default gen_random_uuid(),
  assign_id uuid not null references public.training_plan_user_assigns (id) on delete cascade,
  autonum_cycle smallint not null,
  expected_km numeric,
  expected_time interval,
  description text
);

create index tpuawd_assign_idx on public.training_plan_user_assign_week_definitions (assign_id);

alter table public.training_plan_user_assign_week_definitions enable row level security;

create policy "tpuawd_trainer_all"
  on public.training_plan_user_assign_week_definitions for all
  using (
    exists (
      select 1 from public.training_plan_user_assigns a
      where a.id = assign_id and a.trainer_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.training_plan_user_assigns a
      where a.id = assign_id and a.trainer_id = auth.uid()
    )
  );

create policy "tpuawd_trainee_select"
  on public.training_plan_user_assign_week_definitions for select
  using (
    exists (
      select 1 from public.training_plan_user_assigns a
      where a.id = assign_id and a.user_id = auth.uid()
    )
  );

-- Denní aktivity přiřazeného plánu
create table public.training_plan_user_assign_activity_training_assigns (
  id uuid primary key default gen_random_uuid(),
  assign_id uuid not null references public.training_plan_user_assigns (id) on delete cascade,
  activity_training_id uuid references public.activity_trainings (id),
  autonum_cycle smallint not null,
  autonum_in_cycle smallint not null,
  order_in_cycle smallint,
  name text,
  description text
);

create index tpuaata_assign_idx
  on public.training_plan_user_assign_activity_training_assigns (assign_id);

alter table public.training_plan_user_assign_activity_training_assigns enable row level security;

create policy "tpuaata_trainer_all"
  on public.training_plan_user_assign_activity_training_assigns for all
  using (
    exists (
      select 1 from public.training_plan_user_assigns a
      where a.id = assign_id and a.trainer_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.training_plan_user_assigns a
      where a.id = assign_id and a.trainer_id = auth.uid()
    )
  );

create policy "tpuaata_trainee_select"
  on public.training_plan_user_assign_activity_training_assigns for select
  using (
    exists (
      select 1 from public.training_plan_user_assigns a
      where a.id = assign_id and a.user_id = auth.uid()
    )
  );
