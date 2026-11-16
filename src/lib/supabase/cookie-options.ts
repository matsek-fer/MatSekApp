/**
 * Attributes every writer of the session cookie uses — the browser client,
 * the server client and the middleware — on top of @supabase/ssr's defaults
 * (path=/, SameSite=Lax, a long max-age). The library never sets Secure, and
 * the cookie holds the access and refresh tokens; without it a first visit
 * typed as plain http, before the browser has seen the HSTS header, would
 * send both in clear. Off in development so http://localhost keeps working
 * in every browser.
 */
export const SESSION_COOKIE_OPTIONS = {
  secure: process.env.NODE_ENV === "production",
} as const;
