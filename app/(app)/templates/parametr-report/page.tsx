import type { Metadata } from "next";
import { ParametrReportView } from "@/components/parameters/ParametrReportView";

export const metadata: Metadata = { title: "Hodnoty cvičenců | MTS" };

export default function ParametrReportPage() {
  return <ParametrReportView />;
}
