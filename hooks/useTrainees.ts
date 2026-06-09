"use client";

import { useQuery } from "@tanstack/react-query";
import { useSupabaseClient } from "./useSupabaseClient";
import { queryKeys } from "@/lib/query-keys";
import { getMyTrainees } from "@/lib/services/users";

export function useTrainees(trainerId: string | undefined) {
  const supabase = useSupabaseClient();
  return useQuery({
    queryKey: queryKeys.trainees(trainerId ?? "none"),
    queryFn: () => getMyTrainees(supabase, trainerId!),
    enabled: Boolean(trainerId),
  });
}
