import type { TypedSupabaseClient } from "@/lib/supabase/client";
import type { Activity, ActivityGroup, ActivityTraining, ParamUnit } from "@/types/domain";
import type { TablesInsert, TablesUpdate } from "@/types/database";

export async function getAllActivities(supabase: TypedSupabaseClient): Promise<Activity[]> {
  const { data, error } = await supabase.from("activities").select("*").order("name");
  if (error) throw error;
  return data ?? [];
}

export async function getEnabledActivityIds(
  supabase: TypedSupabaseClient,
  userId: string,
): Promise<string[]> {
  const { data, error } = await supabase
    .from("trainer_activity_enable")
    .select("activity_id")
    .eq("user_id", userId);
  if (error) throw error;
  return (data ?? []).map((r) => r.activity_id);
}

export async function setActivityEnabled(
  supabase: TypedSupabaseClient,
  userId: string,
  activityId: string,
  enabled: boolean,
): Promise<void> {
  if (enabled) {
    const { error } = await supabase
      .from("trainer_activity_enable")
      .upsert({ user_id: userId, activity_id: activityId });
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("trainer_activity_enable")
      .delete()
      .eq("user_id", userId)
      .eq("activity_id", activityId);
    if (error) throw error;
  }
}

export async function getParamUnits(supabase: TypedSupabaseClient): Promise<ParamUnit[]> {
  const { data, error } = await supabase
    .from("activity_training_param_units")
    .select("*")
    .order("name");
  if (error) throw error;
  return data ?? [];
}

// ---- Skupiny ----

export async function getGroups(
  supabase: TypedSupabaseClient,
  activityId: string,
  userId: string,
): Promise<ActivityGroup[]> {
  const { data, error } = await supabase
    .from("activity_groups")
    .select("*")
    .eq("activity_id", activityId)
    .eq("user_id", userId)
    .order("name");
  if (error) throw error;
  return data ?? [];
}

export async function createGroup(
  supabase: TypedSupabaseClient,
  input: TablesInsert<"activity_groups">,
): Promise<ActivityGroup> {
  const { data, error } = await supabase.from("activity_groups").insert(input).select("*").single();
  if (error) throw error;
  return data;
}

export async function updateGroup(
  supabase: TypedSupabaseClient,
  id: string,
  patch: TablesUpdate<"activity_groups">,
): Promise<ActivityGroup> {
  const { data, error } = await supabase
    .from("activity_groups")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function deleteGroup(supabase: TypedSupabaseClient, id: string): Promise<void> {
  const { error } = await supabase.from("activity_groups").delete().eq("id", id);
  if (error) throw error;
}

// ---- Jednotky ----

export async function getTrainings(
  supabase: TypedSupabaseClient,
  groupId: string,
): Promise<ActivityTraining[]> {
  const { data, error } = await supabase
    .from("activity_trainings")
    .select("*")
    .eq("activity_group_id", groupId)
    .order("name");
  if (error) throw error;
  return data ?? [];
}

export async function createTraining(
  supabase: TypedSupabaseClient,
  input: TablesInsert<"activity_trainings">,
): Promise<ActivityTraining> {
  const { data, error } = await supabase
    .from("activity_trainings")
    .insert(input)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function updateTraining(
  supabase: TypedSupabaseClient,
  id: string,
  patch: TablesUpdate<"activity_trainings">,
): Promise<ActivityTraining> {
  const { data, error } = await supabase
    .from("activity_trainings")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTraining(supabase: TypedSupabaseClient, id: string): Promise<void> {
  const { error } = await supabase.from("activity_trainings").delete().eq("id", id);
  if (error) throw error;
}
