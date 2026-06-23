import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";
import { getSupabasePublicEnv } from "@/lib/supabase/env";
import { getSiteUrl } from "@/lib/supabase/site-url";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const nextParam = searchParams.get("next") ?? "/dashboard";
  const next = nextParam.startsWith("/") ? nextParam : "/dashboard";
  const siteUrl = getSiteUrl();

  if (!code) {
    return NextResponse.redirect(`${siteUrl}/login?error=potvrzeni`);
  }

  const cookieStore = await cookies();
  const { url, anonKey } = getSupabasePublicEnv();

  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${siteUrl}/login?error=potvrzeni`);
  }

  return NextResponse.redirect(`${siteUrl}${next}`);
}
