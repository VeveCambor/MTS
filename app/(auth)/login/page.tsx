import type { Metadata } from "next";
import { LoginForm } from "@/components/forms/LoginForm";

export const metadata: Metadata = { title: "Přihlášení | MTS" };

export default function LoginPage() {
  return <LoginForm />;
}
