-- =============================================================
-- seed.sql – globální katalogy (idempotentní)
-- Spouštěj po migracích. Testovací uživatelé se zakládají přes
-- supabase/seed-users.mjs (Supabase Admin API).
-- =============================================================

-- Aktivity (sporty)
insert into public.activities (name, description, icon)
select v.name, v.description, v.icon
from (values
  ('Běh', 'Běžecké tréninky', 'directions_run'),
  ('Cyklistika', 'Silniční i terénní jízda', 'directions_bike'),
  ('Plavání', 'Bazén i otevřená voda', 'pool'),
  ('Triatlon', 'Kombinace plavání, kola a běhu', 'sports_score'),
  ('Posilování', 'Silový trénink', 'fitness_center')
) as v(name, description, icon)
where not exists (select 1 from public.activities);
