/** Veřejná URL aplikace — pro redirecty v auth e-mailech (registrace, reset hesla). */
export function getSiteUrl(): string {
  const configured =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");

  if (configured) return configured;

  if (typeof window !== "undefined") return window.location.origin;

  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  return "http://localhost:3002";
}

export function getAuthCallbackUrl(): string {
  return `${getSiteUrl()}/auth/callback`;
}
