import type { Metadata } from "next";
import { MyProgressView } from "@/components/my-progress/MyProgressView";

export const metadata: Metadata = { title: "Pokrok | MTS" };

export default function MyProgressPage() {
  return <MyProgressView />;
}
