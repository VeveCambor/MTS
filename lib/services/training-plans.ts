import type { TypedSupabaseClient } from "@/lib/supabase/client";
import type { TrainingPlan } from "@/types/domain";
import type { CompleteTrainingPlan, WizardState } from "@/types/training-plan";

function kmToNumber(value: string): number | null {
  const n = Number(value.replace(",", "."));
  return value.trim() === "" || Number.isNaN(n) ? null : n;
}

function timeToInterval(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const match = trimmed.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  return `${match[1]}:${match[2]}:00`;
}

export async function getPlans(
  supabase: TypedSupabaseClient,
  trainerId: string,
): Promise<TrainingPlan[]> {
  const { data, error } = await supabase
    .from("training_plans")
    .select("*")
    .eq("trainer_id", trainerId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getPlanComplete(
  supabase: TypedSupabaseClient,
  planId: string,
): Promise<CompleteTrainingPlan> {
  const { data: plan, error } = await supabase
    .from("training_plans")
    .select("*")
    .eq("id", planId)
    .single();
  if (error) throw error;

  const [{ data: weeks, error: weeksErr }, { data: activities, error: actErr }] = await Promise.all([
    supabase
      .from("training_plan_week_definitions")
      .select("*")
      .eq("training_plan_id", planId)
      .order("autonum_cycle"),
    supabase
      .from("training_plan_activity_training_assigns")
      .select("*")
      .eq("training_plan_id", planId)
      .order("autonum_cycle")
      .order("autonum_in_cycle"),
  ]);
  if (weeksErr) throw weeksErr;
  if (actErr) throw actErr;

  return { ...plan, weeks: weeks ?? [], activities: activities ?? [] };
}

export async function setPlanEnabled(
  supabase: TypedSupabaseClient,
  id: string,
  enabled: boolean,
): Promise<void> {
  const { error } = await supabase.from("training_plans").update({ enabled }).eq("id", id);
  if (error) throw error;
}

export async function deletePlan(supabase: TypedSupabaseClient, id: string): Promise<void> {
  const { error } = await supabase.from("training_plans").delete().eq("id", id);
  if (error) throw error;
}

/**
 * Sekvenční uložení šablony: plán → týdny → denní aktivity.
 * Vrací id nově vytvořené šablony.
 */
export async function saveTemplate(
  supabase: TypedSupabaseClient,
  trainerId: string,
  state: WizardState,
): Promise<string> {
  const { data: plan, error } = await supabase
    .from("training_plans")
    .insert({
      trainer_id: trainerId,
      name: state.name,
      description: state.description || null,
      cycle_length: state.cycleLength,
      number_of_cycles: state.numberOfCycles,
    })
    .select("id")
    .single();
  if (error) throw error;

  const planId = plan.id;

  if (state.weeks.length > 0) {
    const { error: weeksErr } = await supabase.from("training_plan_week_definitions").insert(
      state.weeks.map((w) => ({
        training_plan_id: planId,
        autonum_cycle: w.autonumCycle,
        expected_km: kmToNumber(w.expectedKm),
        expected_time: timeToInterval(w.expectedTime),
        description: w.description || null,
      })),
    );
    if (weeksErr) throw weeksErr;
  }

  const filledActivities = state.activities.filter((a) => a.activityTrainingId || a.name.trim());
  if (filledActivities.length > 0) {
    const { error: actErr } = await supabase
      .from("training_plan_activity_training_assigns")
      .insert(
        filledActivities.map((a) => ({
          training_plan_id: planId,
          activity_training_id: a.activityTrainingId,
          autonum_cycle: a.autonumCycle,
          autonum_in_cycle: a.autonumInCycle,
          order_in_cycle: a.autonumInCycle,
          name: a.name || null,
          description: a.description || null,
        })),
      );
    if (actErr) throw actErr;
  }

  return planId;
}
