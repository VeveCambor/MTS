import { addDays, format } from "date-fns";
import { cs } from "date-fns/locale";
import type { WizardActivity, WizardState } from "@/types/training-plan";

/** Převede textové číslo (s čárkou i tečkou) na number, prázdné = 0. */
export function parseNum(value: string): number {
  const n = Number(String(value).replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

/** Čas v minutách z km a tempa (min/km), zaokrouhleno nahoru. */
export function kmToMinutes(km: number, paceMinutes: number): number {
  return Math.ceil(km * paceMinutes);
}

/** Minuty → "H:MM". */
export function minutesToHhmm(minutes: number): string {
  const m = Math.max(0, Math.round(minutes));
  const h = Math.floor(m / 60);
  const rest = m % 60;
  return `${h}:${String(rest).padStart(2, "0")}`;
}

/** "H:MM" nebo prosté minuty ("90") → minuty. */
export function hhmmToMinutes(value: string): number {
  const trimmed = value.trim();
  if (!trimmed) return 0;
  const match = trimmed.match(/^(\d{1,3}):(\d{1,2})$/);
  if (match) return Number(match[1]) * 60 + Number(match[2]);
  return parseNum(trimmed);
}

/** Datum konkrétního dne plánu (týden + den v týdnu). */
export function dayDate(state: WizardState, autonumCycle: number, autonumInCycle: number): Date {
  const offset = (autonumCycle - 1) * state.cycleLength + (autonumInCycle - 1);
  return addDays(new Date(state.dateTimeStart), offset);
}

/** Formátované datum dne, např. "po 9. 6.". */
export function formatDayDate(date: Date): string {
  return format(date, "EEEEEE d. M.", { locale: cs });
}

/** Součet km a minut za týden ze zadaných denních aktivit. */
export function weekTotals(activities: WizardActivity[]): { km: number; minutes: number } {
  return activities.reduce(
    (acc, a) => ({
      km: acc.km + parseNum(a.km),
      minutes: acc.minutes + hhmmToMinutes(a.time),
    }),
    { km: 0, minutes: 0 },
  );
}
