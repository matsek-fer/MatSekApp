/**
 * The session cookie's name and options, in their own module because the
 * middleware runs on the Edge runtime and must not import anything that
 * reaches Postgres or node:crypto.
 */

export const SESSION_COOKIE = "matsek_session";

const SESSION_DAYS = 30;
export const SESSION_MAX_AGE_SECONDS = SESSION_DAYS * 24 * 60 * 60;

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}
