/**
 * Where a member's provider key lives while they are reading.
 *
 * It lives in an httpOnly cookie and nowhere else — not in Postgres, not in
 * localStorage. Two reasons:
 *
 *   - httpOnly means script on the page cannot read it. The reader renders
 *     model output, which is the likeliest place in this app for an XSS to
 *     land, and that is exactly the script that must not be able to lift a
 *     member's credential.
 *   - Nothing durable means there is no database of other people's paid API
 *     keys to lose. The cost is that members re-enter the key now and then.
 *
 * The value is sealed (see lib/ai/crypto.ts) rather than stored raw, so the
 * cookie is useless on its own if it turns up in a proxy log or a browser
 * profile dump. The sealing format is the one a stored row would use, so the
 * opt-in "remember my key" this is designed to grow into needs no migration.
 */

import { cookies } from "next/headers";
import { openApiKey } from "@/lib/ai/crypto";
import { redactError } from "@/lib/ai/errors";
import type { AiProvider } from "@/lib/ai/types";

/**
 * A ceiling, not the intended lifetime.
 *
 * Omitting maxAge would make this a true session cookie, but browsers restore
 * sessions and would then hold the key indefinitely. Twelve hours outlives a
 * reading session and expires well inside a day.
 */
const MAX_AGE_SECONDS = 12 * 60 * 60;

export function keyCookieName(provider: AiProvider): string {
  return `matsek_ai_key_${provider}`;
}

/** The options every write of a key cookie uses. Kept in one place on purpose. */
export function keyCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  };
}

/**
 * Returns the member's plaintext key, or null if they have not entered one.
 *
 * Null is also what a tampered, expired, or wrong-member cookie produces: the
 * caller's job in every one of those cases is the same — ask for the key
 * again — so they are not worth distinguishing here.
 */
export function loadUserKey(userId: string, provider: AiProvider): string | null {
  const sealed = cookies().get(keyCookieName(provider))?.value;
  if (!sealed) return null;

  try {
    return openApiKey(sealed, userId, provider);
  } catch (err) {
    console.error("AI key open failed:", redactError(err));
    return null;
  }
}

/** The last four characters of a stored key, for showing which one is saved. */
export function loadUserKeySuffix(
  userId: string,
  provider: AiProvider
): string | null {
  const plain = loadUserKey(userId, provider);
  return plain ? plain.slice(-4) : null;
}
