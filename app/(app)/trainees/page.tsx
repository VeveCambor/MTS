import type { Metadata } from "next";
import { TraineesView } from "@/components/trainees/TraineesView";

export const metadata: Metadata = { title: "Sportovci | MTS" };

export default function TraineesPage() {
  return <TraineesView />;
}
