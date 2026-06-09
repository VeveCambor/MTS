import type { Metadata } from "next";
import { SportDetail } from "@/components/activities/SportDetail";

export const metadata: Metadata = { title: "Sport | MTS" };

export default async function SportPage({ params }: { params: Promise<{ sport: string }> }) {
  const { sport } = await params;
  return <SportDetail activityId={sport} />;
}
