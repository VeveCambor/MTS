import type { Metadata } from "next";
import { MyTrainingPlanView } from "@/components/my-plan/MyTrainingPlanView";

export const metadata: Metadata = { title: "Můj plán | MTS" };

export default function MyTrainingPlanPage() {
  return <MyTrainingPlanView />;
}
