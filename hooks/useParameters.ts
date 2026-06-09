"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSupabaseClient } from "./useSupabaseClient";
import { queryKeys } from "@/lib/query-keys";
import {
  createParameter,
  deleteParameter,
  getActualParametersForUser,
  getAllMyParameters,
  getParameterTypes,
  getParametersByTrainer,
  getParametersForActivity,
  updateParameter,
  upsertActualParameter,
} from "@/lib/services/parameters";
import type { TablesInsert, TablesUpdate } from "@/types/database";

export function useParameterTypes() {
  const supabase = useSupabaseClient();
  return useQuery({
    queryKey: queryKeys.parameterTypes,
    queryFn: () => getParameterTypes(supabase),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAllMyParameters(userId: string | undefined) {
  const supabase = useSupabaseClient();
  return useQuery({
    queryKey: queryKeys.parameters(userId ?? "none"),
    queryFn: () => getAllMyParameters(supabase, userId!),
    enabled: Boolean(userId),
  });
}

export function useTrainerCatalog(trainerId: string | undefined) {
  const supabase = useSupabaseClient();
  return useQuery({
    queryKey: ["trainer-catalog", trainerId ?? "none"],
    queryFn: () => getParametersByTrainer(supabase, trainerId!),
    enabled: Boolean(trainerId),
  });
}

export function useTrainerParameters(activityId: string, userId: string | undefined) {
  const supabase = useSupabaseClient();
  const queryClient = useQueryClient();
  const key = queryKeys.parametersForActivity(userId ?? "none", activityId);

  const list = useQuery({
    queryKey: key,
    queryFn: () => getParametersForActivity(supabase, userId!, activityId),
    enabled: Boolean(userId),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: key });

  const create = useMutation({
    mutationFn: (input: TablesInsert<"trainer_parameters">) => createParameter(supabase, input),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: TablesUpdate<"trainer_parameters"> }) =>
      updateParameter(supabase, id, patch),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteParameter(supabase, id),
    onSuccess: invalidate,
  });

  return { ...list, create, update, remove };
}

export function useActualParameters(userId: string | undefined) {
  const supabase = useSupabaseClient();
  const queryClient = useQueryClient();
  const key = queryKeys.actualParams(userId ?? "none");

  const list = useQuery({
    queryKey: key,
    queryFn: () => getActualParametersForUser(supabase, userId!),
    enabled: Boolean(userId),
  });

  const add = useMutation({
    mutationFn: (input: TablesInsert<"actual_user_parameters">) =>
      upsertActualParameter(supabase, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: key }),
  });

  return { ...list, add };
}
