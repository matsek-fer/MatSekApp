/**
 * Sessions: who is asking, on every server render and route.
 *
 * The cookie carries 32 random bytes; the database keeps only their SHA-256,
 * so reading auth.sessions does not yield a usable session. Lookups go
 * through asService() because app_request has no grant on the auth schema.
 *
 * getCurrentUser() is wrapped in React's cache(), so a page whose layout,
 * page and components each ask still costs one query per request.
 */

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHash, randomBytes } from "node:crypto";
import { asService, type Tx } from "@/lib/db";
import type { UserRole } from "@/types";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  sessionCookieOptions,
} from "@/lib/auth/cookie";

const SESSION_DAYS = SESSION_MAX_AGE_SECONDS / (24 * 60 * 60);

export interface CurrentUser {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * Starts a session for a confirmed user and sets its cookie. Route handlers
 * only — Server Components cannot write cookies.
 */
export async function startSession(tx: Tx, userId: string): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  await tx`
    INSERT INTO auth.sessions (user_id, token_hash, expires_at)
    VALUES (${userId}, ${hashToken(token)},
            now() + make_interval(days => ${SESSION_DAYS}))
  `;
  (await cookies()).set(SESSION_COOKIE, token, sessionCookieOptions());
}

/** Ends the current session, if any, and clears its cookie. */
export async function endSession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    await asService(
      (tx) => tx`DELETE FROM auth.sessions WHERE token_hash = ${hashToken(token)}`
    );
  }
  store.delete(SESSION_COOKIE);
}

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  return asService(async (tx) => {
    const [row] = await tx<(CurrentUser & { session_id: string; stale: boolean })[]>`
      SELECT p.id, p.email, p.full_name, p.role,
             s.id AS session_id,
             s.last_seen_at < now() - interval '1 day' AS stale
      FROM auth.sessions s
      JOIN auth.users u ON u.id = s.user_id
      JOIN public.profiles p ON p.id = u.id
      WHERE s.token_hash = ${hashToken(token)}
        AND s.expires_at > now()
        AND u.email_confirmed_at IS NOT NULL
    `;
    if (!row) return null;

    // Sliding expiry, written at most once a day so a busy member does not
    // turn every page view into an UPDATE. The middleware renews the
    // cookie's own max-age to match.
    if (row.stale) {
      await tx`
        UPDATE auth.sessions
        SET last_seen_at = now(),
            expires_at = now() + make_interval(days => ${SESSION_DAYS})
        WHERE id = ${row.session_id}
      `;
    }

    return { id: row.id, email: row.email, full_name: row.full_name, role: row.role };
  });
});

/** For protected pages: the member, or a redirect to /login that comes back. */
export async function requireUser(next: string): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(next)}`);
  return user;
}

export async function requireAdmin(): Promise<CurrentUser> {
  const user = await requireUser("/admin");
  if (user.role !== "admin") redirect("/calendar");
  return user;
}

/** Signs a user out everywhere, e.g. after a password reset. */
export async function endAllSessions(tx: Tx, userId: string): Promise<void> {
  await tx`DELETE FROM auth.sessions WHERE user_id = ${userId}`;
}
