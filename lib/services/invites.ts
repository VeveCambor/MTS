import type { TypedSupabaseClient } from "@/lib/supabase/client";
import type {
  TrainerInvite,
  TrainerInviteListItem,
  TrainerInvitePreview,
} from "@/types/domain";

export async function listTrainerInvites(
  supabase: TypedSupabaseClient,
): Promise<TrainerInviteListItem[]> {
  const { data, error } = await supabase.rpc("list_trainer_invites");
  if (error) throw error;
  return data ?? [];
}

export async function createTrainerInvite(
  supabase: TypedSupabaseClient,
  email: string,
): Promise<TrainerInvite> {
  const { data, error } = await supabase.rpc("create_trainer_invite", { p_email: email });
  if (error) throw error;
  return data;
}

export async function acceptTrainerInvite(
  supabase: TypedSupabaseClient,
  code: string,
): Promise<string> {
  const { data, error } = await supabase.rpc("accept_trainer_invite", { p_code: code });
  if (error) throw error;
  return data;
}

export async function cancelTrainerInvite(
  supabase: TypedSupabaseClient,
  inviteId: string,
): Promise<void> {
  const { error } = await supabase.rpc("cancel_trainer_invite", { p_invite_id: inviteId });
  if (error) throw error;
}

export async function getTrainerInvitePreview(
  supabase: TypedSupabaseClient,
  code: string,
): Promise<TrainerInvitePreview | null> {
  const { data, error } = await supabase.rpc("get_trainer_invite_preview", { p_code: code });
  if (error) throw error;
  return data?.[0] ?? null;
}

export function trainerDisplayName(item: {
  trainer_first_name?: string | null;
  trainer_last_name?: string | null;
  trainer_nick?: string;
}): string {
  const full = [item.trainer_first_name, item.trainer_last_name].filter(Boolean).join(" ");
  return full || item.trainer_nick || "Trenér";
}

export function translateInviteError(message: string): string {
  if (/Neplatný e-mail/i.test(message)) return "Zadej platný e-mail.";
  if (/Pouze trenér/i.test(message)) return "Pozvánky může posílat pouze trenér.";
  if (/Nemůžeš pozvat sám sebe/i.test(message)) return "Nemůžeš pozvat sám sebe.";
  if (/už tvůj cvičenec/i.test(message)) return "Tento sportovec je už tvůj cvičenec.";
  if (/jiný e-mail/i.test(message)) return "Pozvánka je pro jiný e-mail než tvůj účet.";
  if (/Pouze cvičenec|pouze cvičenec/i.test(message)) return "Pozvánku může přijmout pouze cvičenec.";
  if (/jiného trenéra/i.test(message)) return "Už máš přiřazeného jiného trenéra.";
  if (/neexistuje|vypršela|použita/i.test(message)) return "Pozvánka neexistuje, vypršela nebo už byla použita.";
  if (/Nemáš oprávnění/i.test(message)) return "Nemáš oprávnění zrušit tuto pozvánku.";
  return message;
}
