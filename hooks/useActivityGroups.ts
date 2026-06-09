"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSupabaseClient } from "./useSupabaseClient";
import { queryKeys } from "@/lib/query-keys";
import {
  createGroup,
  deleteGroup,
  getGroups,
  updateGroup,
} from "@/lib/services/activities";
import type { TablesInsert, TablesUpdate } from "@/types/database";

export function useActivityGroups(activityId: string, userId: string | undefined) {
  const supabase = useSupabaseClient();
  const queryClient = useQueryClient();
  const key = queryKeys.groups(activityId);

  const list = useQuery({
    queryKey: key,
    queryFn: () => getGroups(supabase, activityId, userId!),
    enabled: Boolean(userId),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: key });

  const create = useMutation({
    mutationFn: (input: TablesInsert<"activity_groups">) => createGroup(supabase, input),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: TablesUpdate<"activity_groups"> }) =>
      updateGroup(supabase, id, patch),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteGroup(supabase, id),
    onSuccess: invalidate,
  });

  return { ...list, create, update, remove };
}
