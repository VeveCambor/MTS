"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { getCurrentProfile } from "@/lib/services/users";
import { queryKeys } from "@/lib/query-keys";
import { isTrainee, isTrainer } from "@/lib/constants/roles";

export function useProfile() {
  const supabase = useMemo(() => createClient(), []);

  const query = useQuery({
    queryKey: queryKeys.profile,
    queryFn: async () => {
      const timeoutMs = 10_000;
      const result = await Promise.race([
        getCurrentProfile(supabase),
        new Promise<null>((_, reject) =>
          setTimeout(() => reject(new Error("Načtení profilu vypršelo")), timeoutMs),
        ),
      ]);
      return result;
    },
    retry: 1,
  });

  const role = query.data?.role ?? null;

  return {
    ...query,
    profile: query.data ?? null,
    role,
    isTrainer: isTrainer(role),
    isTrainee: isTrainee(role),
  };
}
