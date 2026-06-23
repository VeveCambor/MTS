"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { createClient, type TypedSupabaseClient } from "@/lib/supabase/client";
import { getAuthCallbackUrl } from "@/lib/supabase/site-url";
import { Role } from "@/lib/constants/roles";
import type { AccountType } from "@/lib/validation/auth";

export type RegisterInput = {
  email: string;
  password: string;
  nick: string;
  firstName?: string;
  lastName?: string;
  accountType: AccountType;
};

export function useAuthActions() {
  const clientRef = useRef<TypedSupabaseClient | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getClient = useCallback(() => {
    if (!clientRef.current) clientRef.current = createClient();
    return clientRef.current;
  }, []);

  async function signIn(email: string, password: string) {
    setLoading(true);
    setError(null);
    const supabase = getClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (authError) {
      setError(translateAuthError(authError.message));
      return false;
    }
    await queryClient.invalidateQueries();
    router.refresh();
    router.push("/dashboard");
    return true;
  }

  async function signUp(input: RegisterInput) {
    setLoading(true);
    setError(null);
    const supabase = getClient();
    const role = input.accountType === "trainer" ? Role.Trainer : Role.User;
    const { data, error: authError } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          nick: input.nick,
          first_name: input.firstName,
          last_name: input.lastName,
          role,
        },
        emailRedirectTo: getAuthCallbackUrl(),
      },
    });
    setLoading(false);
    if (authError) {
      setError(translateAuthError(authError.message));
      return false;
    }
    router.refresh();
    if (data.session) {
      router.push("/dashboard");
    } else {
      router.push("/login?registered=1");
    }
    return true;
  }

  async function signOut() {
    const supabase = getClient();
    await supabase.auth.signOut();
    queryClient.clear();
    router.refresh();
    router.push("/login");
  }

  return { signIn, signUp, signOut, loading, error };
}

function translateAuthError(message: string): string {
  if (/invalid login credentials/i.test(message)) return "Neplatný e-mail nebo heslo.";
  if (/already registered|already exists/i.test(message)) return "Uživatel s tímto e-mailem už existuje.";
  if (/password/i.test(message)) return "Heslo nesplňuje požadavky.";
  return message;
}
