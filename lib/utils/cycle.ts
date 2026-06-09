const WEEKDAYS = ["Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota", "Neděle"];

export function dayLabel(day: number, cycleLength: number): string {
  if (cycleLength === 7 && day >= 1 && day <= 7) return WEEKDAYS[day - 1];
  return `Den ${day}`;
}

export function dayLabelShort(day: number, cycleLength: number): string {
  if (cycleLength === 7 && day >= 1 && day <= 7) return WEEKDAYS[day - 1].slice(0, 2);
  return `${day}.`;
}

export function range(from: number, to: number): number[] {
  return Array.from({ length: to - from + 1 }, (_, i) => from + i);
}
