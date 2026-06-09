"use client";

import { useQuery } from "@tanstack/react-query";
import { useSupabaseClient } from "./useSupabaseClient";
import {
  getActivitiesForAssigns,
  getEnabledAssignsForUser,
} from "@/lib/services/assigned-plans";
import { buildCalendarEvents, type CalendarEvent } from "@/lib/utils/schedule";

export function useSchedule(userId: string | undefined) {
  const supabase = useSupabaseClient();

  return useQuery<CalendarEvent[]>({
    queryKey: ["schedule", userId ?? "none"],
    enabled: Boolean(userId),
    queryFn: async () => {
      const assigns = await getEnabledAssignsForUser(supabase, userId!);
      const activities = await getActivitiesForAssigns(
        supabase,
        assigns.map((a) => a.id),
      );
      return buildCalendarEvents(assigns, activities);
    },
  });
}
