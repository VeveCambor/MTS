"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSupabaseClient } from "./useSupabaseClient";
import { queryKeys } from "@/lib/query-keys";
import {
  deletePlan,
  getPlanComplete,
  getPlans,
  saveTemplate,
  setPlanEnabled,
} from "@/lib/services/training-plans";
import type { WizardState } from "@/types/training-plan";

export function useTrainingPlans(trainerId: string | undefined) {
  const supabase = useSupabaseClient();
  const queryClient = useQueryClient();
  const key = queryKeys.plans(trainerId ?? "none");

  const list = useQuery({
    queryKey: key,
    queryFn: () => getPlans(supabase, trainerId!),
    enabled: Boolean(trainerId),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: key });

  const toggleEnabled = useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) =>
      setPlanEnabled(supabase, id, enabled),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => deletePlan(supabase, id),
    onSuccess: invalidate,
  });

  const save = useMutation({
    mutationFn: (state: WizardState) => saveTemplate(supabase, trainerId!, state),
    onSuccess: invalidate,
  });

  return { ...list, toggleEnabled, remove, save };
}

export function usePlanComplete(planId: string | undefined) {
  const supabase = useSupabaseClient();
  return useQuery({
    queryKey: queryKeys.planComplete(planId ?? "none"),
    queryFn: () => getPlanComplete(supabase, planId!),
    enabled: Boolean(planId),
  });
}
