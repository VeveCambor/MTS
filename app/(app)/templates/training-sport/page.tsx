import type { Metadata } from "next";
import { SportPicker } from "@/components/activities/SportPicker";

export const metadata: Metadata = { title: "Skupiny a jednotky | MTS" };

export default function TrainingSportPage() {
  return (
    <SportPicker
      title="Skupiny a jednotky"
      subtitle="Vyber sport, jehož skupiny chceš spravovat"
      hrefBase="/templates/sport"
    />
  );
}
