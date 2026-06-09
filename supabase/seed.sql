-- =============================================================
-- seed.sql – globální katalogy (sjednoceno s POPIS_DESIGN_A_DATA.md)
-- Spouštěj po migracích. Trenérská data (skupiny, parametry, plán)
-- se seedují přes supabase/seed-users.mjs (až po vytvoření trenéra).
--
-- POZOR: truncate ... cascade smaže veškerá doménová data (skupiny,
-- jednotky, parametry, plány, deník). Uživatelé (auth/profiles)
-- zůstávají. Určeno pro dev reset / první naplnění.
-- =============================================================

truncate table
  public.activities,
  public.activity_training_param_units,
  public.parameter_types
restart identity cascade;

-- Aktivity (globální katalog – 8 sportů)
insert into public.activities (name, description, icon) values
  ('Běhání',         'Běh',            'run'),
  ('Plavání',        'Plavání',        'swim'),
  ('Jízda na kole',  'Cyklistika',     'bike'),
  ('Silový tréning', 'Silový tréning', 'gym'),
  ('Chůze',          'Chůze',          'walk'),
  ('Jóga',           'Jóga',           'yoga'),
  ('SM systém',      'SM systém',      'smsystem'),
  ('Běžky',          'Běžky',          'skiing');

-- Měrné jednotky (délka / čas)
insert into public.activity_training_param_units (name, description) values
  ('km',  'Kilometer'),
  ('m',   'Metr'),
  ('h',   'Hodina'),
  ('min', 'Minuta'),
  ('s',   'Sekunda');

-- Typy parametrů (globální)
insert into public.parameter_types (name, description) values
  ('Rychlost', 'Rychlost'),
  ('Tepy',     'Tepová frekvence'),
  ('Tempo',    'Tempo běhu');
