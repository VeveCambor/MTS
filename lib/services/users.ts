import type { TypedSupabaseClient } from "@/lib/supabase/client";
import type { Profile, UserShort } from "@/types/domain";
import type { TablesUpdate } from "@/types/database";

export async function getCurrentProfile(supabase: TypedSupabaseClient): Promise<Profile | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (error) throw error;
  return data;
}

export async function getMyTrainees(
  supabase: TypedSupabaseClient,
  trainerId: string,
): Promise<UserShort[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, nick, first_name, last_name, role")
    .eq("trainer_id", trainerId)
    .order("last_name", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function updateProfile(
  supabase: TypedSupabaseClient,
  id: string,
  patch: TablesUpdate<"profiles">,
): Promise<Profile> {
  const { data, error } = await supabase
    .from("profiles")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}
