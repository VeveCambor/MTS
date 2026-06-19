/** Veřejné Supabase proměnné – dostupné v browseru i na serveru (Vercel build/runtime). */
export function getSupabasePublicEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Chybí NEXT_PUBLIC_SUPABASE_URL nebo NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
        "Nastav je v .env.local (lokálně) nebo ve Vercel → Settings → Environment Variables (Production + Preview).",
    );
  }

  return { url, anonKey };
}
