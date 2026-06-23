"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSupabaseClient } from "./useSupabaseClient";
import {
  acceptTrainerInvite,
  cancelTrainerInvite,
  createTrainerInvite,
  listTrainerInvites,
} from "@/lib/services/invites";
import { queryKeys } from "@/lib/query-keys";

export function useTrainerInvites(enabled = true) {
  const supabase = useSupabaseClient();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.trainerInvites,
    queryFn: () => listTrainerInvites(supabase),
    enabled,
  });

  const create = useMutation({
    mutationFn: (email: string) => createTrainerInvite(supabase, email),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.trainerInvites }),
  });

  const cancel = useMutation({
    mutationFn: (inviteId: string) => cancelTrainerInvite(supabase, inviteId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.trainerInvites }),
  });

  const accept = useMutation({
    mutationFn: (code: string) => acceptTrainerInvite(supabase, code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.trainerInvites });
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
      queryClient.invalidateQueries({ predicate: (q) => q.queryKey[0] === "trainees" });
    },
  });

  return { ...query, create, cancel, accept };
}
