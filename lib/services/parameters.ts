import type { TypedSupabaseClient } from "@/lib/supabase/client";
import type { ParameterType, TrainerParameter, ActualUserParameter } from "@/types/domain";
import type { TablesInsert, TablesUpdate } from "@/types/database";

export async function getParameterTypes(supabase: TypedSupabaseClient): Promise<ParameterType[]> {
  const { data, error } = await supabase.from("parameter_types").select("*").order("name");
  if (error) throw error;
  return data ?? [];
}

export async function getAllMyParameters(
  supabase: TypedSupabaseClient,
  userId: string,
): Promise<TrainerParameter[]> {
  const { data, error } = await supabase
    .from("trainer_parameters")
    .select("*")
    .eq("user_id", userId)
    .order("name");
  if (error) throw error;
  return data ?? [];
}

export async function getParametersByTrainer(
  supabase: TypedSupabaseClient,
  trainerId: string,
): Promise<TrainerParameter[]> {
  const { data, error } = await supabase
    .from("trainer_parameters")
    .select("*")
    .eq("user_id", trainerId)
    .order("name");
  if (error) throw error;
  return data ?? [];
}

export async function getParametersForActivity(
  supabase: TypedSupabaseClient,
  userId: string,
  activityId: string,
): Promise<TrainerParameter[]> {
  const { data, error } = await supabase
    .from("trainer_parameters")
    .select("*")
    .eq("user_id", userId)
    .eq("activity_id", activityId)
    .order("name");
  if (error) throw error;
  return data ?? [];
}

export async function createParameter(
  supabase: TypedSupabaseClient,
  input: TablesInsert<"trainer_parameters">,
): Promise<TrainerParameter> {
  const { data, error } = await supabase
    .from("trainer_parameters")
    .insert(input)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function updateParameter(
  supabase: TypedSupabaseClient,
  id: string,
  patch: TablesUpdate<"trainer_parameters">,
): Promise<TrainerParameter> {
  const { data, error } = await supabase
    .from("trainer_parameters")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function deleteParameter(supabase: TypedSupabaseClient, id: string): Promise<void> {
  const { error } = await supabase.from("trainer_parameters").delete().eq("id", id);
  if (error) throw error;
}

// ---- Aktuální hodnoty cvičence ----

export async function getActualParametersForUser(
  supabase: TypedSupabaseClient,
  userId: string,
): Promise<ActualUserParameter[]> {
  const { data, error } = await supabase
    .from("actual_user_parameters")
    .select("*")
    .eq("user_id", userId)
    .order("recorded_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function upsertActualParameter(
  supabase: TypedSupabaseClient,
  input: TablesInsert<"actual_user_parameters">,
): Promise<ActualUserParameter> {
  const { data, error } = await supabase
    .from("actual_user_parameters")
    .insert(input)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}
