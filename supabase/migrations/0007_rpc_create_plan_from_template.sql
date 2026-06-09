-- =============================================================
-- 0007_rpc_create_plan_from_template.sql
-- RPC: kopie šablony plánu do přiřazeného plánu cvičence
-- =============================================================

create or replace function public.create_plan_from_template(
  p_template_id uuid,
  p_user_id uuid,
  p_start_date timestamptz
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_trainer_id uuid := auth.uid();
  v_assign_id uuid;
begin
  -- Ověř, že volající vlastní šablonu
  if not exists (
    select 1 from public.training_plans p
    where p.id = p_template_id and p.trainer_id = v_trainer_id
  ) then
    raise exception 'Šablona neexistuje nebo k ní nemáš oprávnění';
  end if;

  -- Ověř, že cílový uživatel je cvičenec volajícího trenéra
  if not exists (
    select 1 from public.profiles pr
    where pr.id = p_user_id and pr.trainer_id = v_trainer_id
  ) then
    raise exception 'Uživatel není tvým cvičencem';
  end if;

  -- 1) Hlavička přiřazeného plánu
  insert into public.training_plan_user_assigns
    (user_id, trainer_id, name, description, cycle_length, number_of_cycles, enabled,
     date_time_start, source_template_id)
  select p_user_id, v_trainer_id, p.name, p.description, p.cycle_length, p.number_of_cycles,
         true, p_start_date, p.id
  from public.training_plans p
  where p.id = p_template_id
  returning id into v_assign_id;

  -- 2) Týdny
  insert into public.training_plan_user_assign_week_definitions
    (assign_id, autonum_cycle, expected_km, expected_time, description)
  select v_assign_id, w.autonum_cycle, w.expected_km, w.expected_time, w.description
  from public.training_plan_week_definitions w
  where w.training_plan_id = p_template_id;

  -- 3) Denní aktivity
  insert into public.training_plan_user_assign_activity_training_assigns
    (assign_id, activity_training_id, autonum_cycle, autonum_in_cycle, order_in_cycle, name, description)
  select v_assign_id, a.activity_training_id, a.autonum_cycle, a.autonum_in_cycle,
         a.order_in_cycle, a.name, a.description
  from public.training_plan_activity_training_assigns a
  where a.training_plan_id = p_template_id;

  return v_assign_id;
end;
$$;

grant execute on function public.create_plan_from_template(uuid, uuid, timestamptz) to authenticated;
