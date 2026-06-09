import type { Metadata } from "next";
import { TemplatesList } from "@/components/plans/TemplatesList";

export const metadata: Metadata = { title: "Šablony plánů | MTS" };

export default function TrainingPlanPage() {
  return <TemplatesList />;
}
