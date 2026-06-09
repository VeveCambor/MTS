-- =============================================================
-- 0002_activities.sql
-- Globální katalog sportů
-- =============================================================

create table public.activities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  icon text
);

alter table public.activities enable row level security;

-- Katalog je čitelný pro všechny přihlášené
create policy "activities_select_all"
  on public.activities for select
  to authenticated
  using (true);
