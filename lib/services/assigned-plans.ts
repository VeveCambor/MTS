import type { TypedSupabaseClient } from "@/lib/supabase/client";
import type { TrainingPlanUserAssign, TrainingPlanUserAssignActivity } from "@/types/domain";
import type { CompleteAssignedPlan } from "@/types/training-plan";

export async function getPlansOfUser(
  supabase: TypedSupabaseClient,
  userId: string,
): Promise<TrainingPlanUserAssign[]> {
  const { data, error } = await supabase
    .from("training_plan_user_assigns")
    .select("*")
    .eq("user_id", userId)
    .order("date_time_start", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getEnabledAssignsForUser(
  supabase: TypedSupabaseClient,
  userId: string,
): Promise<TrainingPlanUserAssign[]> {
  const { data, error } = await supabase
    .from("training_plan_user_assigns")
    .select("*")
    .eq("user_id", userId)
    .eq("enabled", true);
  if (error) throw error;
  return data ?? [];
}

export async function getActivitiesForAssigns(
  supabase: TypedSupabaseClient,
  assignIds: string[],
): Promise<TrainingPlanUserAssignActivity[]> {
  if (assignIds.length === 0) return [];
  const { data, error } = await supabase
    .from("training_plan_user_assign_activity_training_assigns")
    .select("*")
    .in("assign_id", assignIds);
  if (error) throw error;
  return data ?? [];
}

export async function getMyAssignedPlans(
  supabase: TypedSupabaseClient,
  userId: string,
): Promise<TrainingPlanUserAssign[]> {
  return getPlansOfUser(supabase, userId);
}

export async function getAssignedPlanComplete(
  supabase: TypedSupabaseClient,
  assignId: string,
): Promise<CompleteAssignedPlan> {
  const { data: plan, error } = await supabase
    .from("training_plan_user_assigns")
    .select("*")
    .eq("id", assignId)
    .single();
  if (error) throw error;

  const [{ data: weeks, error: weeksErr }, { data: activities, error: actErr }] = await Promise.all([
    supabase
      .from("training_plan_user_assign_week_definitions")
      .select("*")
      .eq("assign_id", assignId)
      .order("autonum_cycle"),
    supabase
      .from("training_plan_user_assign_activity_training_assigns")
      .select("*")
      .eq("assign_id", assignId)
      .order("autonum_cycle")
      .order("autonum_in_cycle"),
  ]);
  if (weeksErr) throw weeksErr;
  if (actErr) throw actErr;

  return { ...plan, weeks: weeks ?? [], activities: activities ?? [] };
}

export async function createPlanFromTemplate(
  supabase: TypedSupabaseClient,
  templateId: string,
  userId: string,
  startDate: string,
): Promise<string> {
  const { data, error } = await supabase.rpc("create_plan_from_template", {
    p_template_id: templateId,
    p_user_id: userId,
    p_start_date: startDate,
  });
  if (error) throw error;
  return data as string;
}

export async function setAssignEnabled(
  supabase: TypedSupabaseClient,
  id: string,
  enabled: boolean,
): Promise<void> {
  const { error } = await supabase
    .from("training_plan_user_assigns")
    .update({ enabled })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteAssign(supabase: TypedSupabaseClient, id: string): Promise<void> {
  const { error } = await supabase.from("training_plan_user_assigns").delete().eq("id", id);
  if (error) throw error;
}
