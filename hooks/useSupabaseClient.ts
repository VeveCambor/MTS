"use client";

import { useRef } from "react";
import { createClient, type TypedSupabaseClient } from "@/lib/supabase/client";

/**
 * Lazy Supabase klient – nevytváří se při SSR/prerenderu, jen při prvním použití v prohlížeči.
 */
export function useSupabaseClient(): TypedSupabaseClient {
  const ref = useRef<TypedSupabaseClient | null>(null);

  if (typeof window !== "undefined" && !ref.current) {
    ref.current = createClient();
  }

  return new Proxy({} as TypedSupabaseClient, {
    get(_target, prop) {
      if (typeof window === "undefined") {
        throw new Error("Supabase klient není dostupný během serverového renderu.");
      }
      if (!ref.current) ref.current = createClient();
      const value = ref.current[prop as keyof TypedSupabaseClient];
      return typeof value === "function" ? value.bind(ref.current) : value;
    },
  });
}
