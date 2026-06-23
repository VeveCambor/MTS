import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/forms/LoginForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Přihlášení | MTS" };

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
