"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSupabaseClient } from "./useSupabaseClient";
import { queryKeys } from "@/lib/query-keys";
import {
  getAllActivities,
  getEnabledActivityIds,
  getParamUnits,
  setActivityEnabled,
} from "@/lib/services/activities";

export function useActivities() {
  const supabase = useSupabaseClient();
  return useQuery({
    queryKey: queryKeys.activities,
    queryFn: () => getAllActivities(supabase),
  });
}

export function useParamUnits() {
  const supabase = useSupabaseClient();
  return useQuery({
    queryKey: queryKeys.units,
    queryFn: () => getParamUnits(supabase),
    staleTime: 5 * 60 * 1000,
  });
}

export function useEnabledActivityIds(userId: string | undefined) {
  const supabase = useSupabaseClient();
  return useQuery({
    queryKey: queryKeys.myActivities(userId ?? "none"),
    queryFn: () => getEnabledActivityIds(supabase, userId!),
    enabled: Boolean(userId),
  });
}

export function useToggleActivity(userId: string | undefined) {
  const supabase = useSupabaseClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ activityId, enabled }: { activityId: string; enabled: boolean }) =>
      setActivityEnabled(supabase, userId!, activityId, enabled),
    onSuccess: () => {
      if (userId) queryClient.invalidateQueries({ queryKey: queryKeys.myActivities(userId) });
    },
  });
}
