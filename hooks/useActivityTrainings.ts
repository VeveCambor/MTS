"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSupabaseClient } from "./useSupabaseClient";
import { queryKeys } from "@/lib/query-keys";
import {
  createTraining,
  deleteTraining,
  getTrainings,
  updateTraining,
} from "@/lib/services/activities";
import type { TablesInsert, TablesUpdate } from "@/types/database";

export function useActivityTrainings(groupId: string, enabled = true) {
  const supabase = useSupabaseClient();
  const queryClient = useQueryClient();
  const key = queryKeys.trainings(groupId);

  const list = useQuery({
    queryKey: key,
    queryFn: () => getTrainings(supabase, groupId),
    enabled,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: key });

  const create = useMutation({
    mutationFn: (input: TablesInsert<"activity_trainings">) => createTraining(supabase, input),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: TablesUpdate<"activity_trainings"> }) =>
      updateTraining(supabase, id, patch),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteTraining(supabase, id),
    onSuccess: invalidate,
  });

  return { ...list, create, update, remove };
}
