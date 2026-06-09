import type { Metadata } from "next";
import { ParametersActivityDetail } from "@/components/parameters/ParametersActivityDetail";

export const metadata: Metadata = { title: "Parametry sportu | MTS" };

export default async function ParametrSportDetailPage({
  params,
}: {
  params: Promise<{ sport: string }>;
}) {
  const { sport } = await params;
  return <ParametersActivityDetail activityId={sport} />;
}
