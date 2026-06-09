-- =============================================================
-- 0008_training_diary.sql
-- Tréninkový deník (poznámky cvičence k tréninkům) + RLS
-- =============================================================

create table public.training_diary_notes (
  id uuid primary key default gen_random_uuid(),
  assign_activity_id uuid not null
    references public.training_plan_user_assign_activity_training_assigns (id) on delete cascade,
  user_id uuid not null references public.profiles (id),
  note text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index tdn_user_idx on public.training_diary_notes (user_id);
create index tdn_activity_idx on public.training_diary_notes (assign_activity_id);

create trigger tdn_set_updated_at
  before update on public.training_diary_notes
  for each row execute function public.set_updated_at();

alter table public.training_diary_notes enable row level security;

-- Cvičenec spravuje své poznámky
create policy "tdn_owner_all"
  on public.training_diary_notes for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Trenér čte poznámky svých cvičenců
create policy "tdn_trainer_select"
  on public.training_diary_notes for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = training_diary_notes.user_id and p.trainer_id = auth.uid()
    )
  );
