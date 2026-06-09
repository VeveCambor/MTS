import type { Metadata } from "next";
import { PlanWizard } from "@/components/plan-wizard/PlanWizard";

export const metadata: Metadata = { title: "Nová šablona | MTS" };

export default function NewTrainingPlanPage() {
  return <PlanWizard />;
}
