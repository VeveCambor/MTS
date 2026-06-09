import { addDays } from "date-fns";
import type {
  TrainingPlanUserAssign,
  TrainingPlanUserAssignActivity,
} from "@/types/domain";

export type CalendarEvent = {
  id: string; // id přiřazené denní aktivity (assign_activity_id pro deník)
  title: string;
  start: Date;
  end: Date;
  allDay: true;
  planName: string;
  description: string | null;
};

/**
 * Rozloží přiřazené plány na konkrétní kalendářní dny.
 * Datum aktivity = date_time_start + ((cyklus-1) * délka_cyklu + (den-1)).
 */
export function buildCalendarEvents(
  assigns: TrainingPlanUserAssign[],
  activities: TrainingPlanUserAssignActivity[],
): CalendarEvent[] {
  const assignMap = new Map(assigns.map((a) => [a.id, a]));
  const events: CalendarEvent[] = [];

  for (const act of activities) {
    const assign = assignMap.get(act.assign_id);
    if (!assign) continue;

    const offset = (act.autonum_cycle - 1) * assign.cycle_length + (act.autonum_in_cycle - 1);
    const date = addDays(new Date(assign.date_time_start), offset);

    events.push({
      id: act.id,
      title: act.name?.trim() || assign.name,
      start: date,
      end: date,
      allDay: true,
      planName: assign.name,
      description: act.description,
    });
  }

  return events;
}
