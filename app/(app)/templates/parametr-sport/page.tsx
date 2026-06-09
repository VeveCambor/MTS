import type { Metadata } from "next";
import { SportPicker } from "@/components/activities/SportPicker";

export const metadata: Metadata = { title: "Parametry | MTS" };

export default function ParametrSportPage() {
  return (
    <SportPicker
      title="Parametry"
      subtitle="Vyber sport, pro který chceš definovat parametry"
      hrefBase="/templates/parametr-sport"
    />
  );
}
