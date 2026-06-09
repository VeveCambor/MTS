import type { TypedSupabaseClient } from "@/lib/supabase/client";
import type { TrainingDiaryNote } from "@/types/domain";
import type { TablesInsert } from "@/types/database";

export async function getNotesForUser(
  supabase: TypedSupabaseClient,
  userId: string,
): Promise<TrainingDiaryNote[]> {
  const { data, error } = await supabase
    .from("training_diary_notes")
    .select("*")
    .eq("user_id", userId);
  if (error) throw error;
  return data ?? [];
}

export async function createNote(
  supabase: TypedSupabaseClient,
  input: TablesInsert<"training_diary_notes">,
): Promise<TrainingDiaryNote> {
  const { data, error } = await supabase
    .from("training_diary_notes")
    .insert(input)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function updateNote(
  supabase: TypedSupabaseClient,
  id: string,
  note: string,
): Promise<TrainingDiaryNote> {
  const { data, error } = await supabase
    .from("training_diary_notes")
    .update({ note })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function deleteNote(supabase: TypedSupabaseClient, id: string): Promise<void> {
  const { error } = await supabase.from("training_diary_notes").delete().eq("id", id);
  if (error) throw error;
}
