"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSupabaseClient } from "./useSupabaseClient";
import { queryKeys } from "@/lib/query-keys";
import {
  createPlanFromTemplate,
  deleteAssign,
  getAssignedPlanComplete,
  getPlansOfUser,
  setAssignEnabled,
} from "@/lib/services/assigned-plans";

export function useAssignedPlans(userId: string | undefined) {
  const supabase = useSupabaseClient();
  const queryClient = useQueryClient();
  const key = queryKeys.assignedPlans(userId ?? "none");

  const list = useQuery({
    queryKey: key,
    queryFn: () => getPlansOfUser(supabase, userId!),
    enabled: Boolean(userId),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: key });

  const toggleEnabled = useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) =>
      setAssignEnabled(supabase, id, enabled),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteAssign(supabase, id),
    onSuccess: invalidate,
  });

  const assignFromTemplate = useMutation({
    mutationFn: ({
      templateId,
      startDate,
    }: {
      templateId: string;
      startDate: string;
    }) => createPlanFromTemplate(supabase, templateId, userId!, startDate),
    onSuccess: invalidate,
  });

  return { ...list, toggleEnabled, remove, assignFromTemplate };
}

export function useAssignedPlanComplete(assignId: string | undefined) {
  const supabase = useSupabaseClient();
  return useQuery({
    queryKey: queryKeys.assignedPlanComplete(assignId ?? "none"),
    queryFn: () => getAssignedPlanComplete(supabase, assignId!),
    enabled: Boolean(assignId),
  });
}
