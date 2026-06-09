import type { Metadata } from "next";
import { PlanDetail } from "@/components/plans/PlanDetail";

export const metadata: Metadata = { title: "Detail šablony | MTS" };

export default async function TrainingPlanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PlanDetail planId={id} />;
}
