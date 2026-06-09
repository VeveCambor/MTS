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

-- Měrné jednotky
insert into public.activity_training_param_units (name, description)
select v.name, v.description
from (values
  ('km', 'kilometr'),
  ('m', 'metr'),
  ('h', 'hodina'),
  ('min', 'minuta'),
  ('s', 'sekunda')
) as v(name, description)
where not exists (select 1 from public.activity_training_param_units);

-- Typy parametrů
insert into public.parameter_types (name, description)
select v.name, v.description
from (values
  ('Vzdálenost', 'Délka tréninku'),
  ('Čas', 'Doba trvání'),
  ('Tepová frekvence', 'HR zóna nebo tepy'),
  ('Tempo', 'Rychlost / tempo'),
  ('Opakování', 'Počet opakování / sérií')
) as v(name, description)
where not exists (select 1 from public.parameter_types);
