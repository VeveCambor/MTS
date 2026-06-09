-- =============================================================
-- 0005_training_plans.sql
-- Šablony tréninkových plánů (trenér) + týdny + denní aktivity
-- =============================================================

create table public.training_plans (
  id uuid primary key default gen_random_uuid(),
  trainer_id uuid not null references public.profiles (id),
  name text not null,
  description text,
  cycle_length smallint not null,
  number_of_cycles smallint not null,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index training_plans_trainer_idx on public.training_plans (trainer_id);

create trigger training_plans_set_updated_at
  before update on public.training_plans
  for each row execute function public.set_updated_at();

alter table public.training_plans enable row level security;

create policy "training_plans_owner_all"
  on public.training_plans for all
  using (trainer_id = auth.uid())
  with check (trainer_id = auth.uid());

-- Týdny / cykly šablony
create table public.training_plan_week_definitions (
  id uuid primary key default gen_random_uuid(),
  training_plan_id uuid not null references public.training_plans (id) on delete cascade,
  autonum_cycle smallint not null,
  expected_km numeric,
  expected_time interval,
  description text
);

create index tpwd_plan_idx on public.training_plan_week_definitions (training_plan_id);

alter table public.training_plan_week_definitions enable row level security;

create policy "tpwd_owner_all"
  on public.training_plan_week_definitions for all
  using (
    exists (
      select 1 from public.training_plans p
      where p.id = training_plan_id and p.trainer_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.training_plans p
      where p.id = training_plan_id and p.trainer_id = auth.uid()
    )
  );

-- Denní aktivity šablony
create table public.training_plan_activity_training_assigns (
  id uuid primary key default gen_random_uuid(),
  training_plan_id uuid not null references public.training_plans (id) on delete cascade,
  activity_training_id uuid references public.activity_trainings (id),
  autonum_cycle smallint not null,
  autonum_in_cycle smallint not null,
  order_in_cycle smallint,
  name text,
  description text
);

create index tpata_plan_idx on public.training_plan_activity_training_assigns (training_plan_id);

alter table public.training_plan_activity_training_assigns enable row level security;

create policy "tpata_owner_all"
  on public.training_plan_activity_training_assigns for all
  using (
    exists (
      select 1 from public.training_plans p
      where p.id = training_plan_id and p.trainer_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.training_plans p
      where p.id = training_plan_id and p.trainer_id = auth.uid()
    )
  );
