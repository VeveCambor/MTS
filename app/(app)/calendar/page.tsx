import type { Metadata } from "next";
import { TrainingCalendar } from "@/components/calendar/TrainingCalendar";

export const metadata: Metadata = { title: "Kalendář | MTS" };

export default function CalendarPage() {
  return <TrainingCalendar />;
}
