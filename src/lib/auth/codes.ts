/**
 * Six-digit email codes (signup confirmation, password recovery) and the
 * pre-login throttles that Supabase Auth used to apply for us.
 *
 * A code is a 10^6 space, which is only safe because guessing is capped:
 * MAX_ATTEMPTS wrong tries burn the code, and the send throttle limits how
 * many fresh codes an attacker can ask for. Codes are stored hashed with the
 * user and purpose mixed in, so a signup code cannot be replayed as a
 * recovery code even within its fifteen minutes.
 */

import { createHash, randomInt, timingSafeEqual } from "node:crypto";
import type { Tx } from "@/lib/db";

export type CodePurpose = "signup" | "recovery";

const CODE_TTL_MINUTES = 15;
const MAX_ATTEMPTS = 5;

function hashCode(userId: string, purpose: CodePurpose, code: string): string {
  return createHash("sha256").update(`${userId}:${purpose}:${code}`).digest("hex");
}

/** Issues a fresh code, replacing any earlier one for the same purpose. */
export async function issueCode(
  tx: Tx,
  userId: string,
  purpose: CodePurpose
): Promise<string> {
  const code = randomInt(0, 1_000_000).toString().padStart(6, "0");
  await tx`
    INSERT INTO auth.one_time_codes (user_id, purpose, code_hash, expires_at)
    VALUES (${userId}, ${purpose}, ${hashCode(userId, purpose, code)},
            now() + make_interval(mins => ${CODE_TTL_MINUTES}))
    ON CONFLICT (user_id, purpose) DO UPDATE SET
      code_hash  = EXCLUDED.code_hash,
      expires_at = EXCLUDED.expires_at,
      attempts   = 0,
      created_at = now()
  `;
  return code;
}

/**
 * True if `code` is the live code for this user and purpose, which is then
 * consumed. Every call counts as an attempt, right or wrong, and the counter
 * is bumped in the same statement that reads it, so parallel guesses cannot
 * all slip in under the cap.
 */
export async function redeemCode(
  tx: Tx,
  userId: string,
  purpose: CodePurpose,
  code: string
): Promise<boolean> {
  const [row] = await tx<{ code_hash: string }[]>`
    UPDATE auth.one_time_codes
    SET attempts = attempts + 1
    WHERE user_id = ${userId} AND purpose = ${purpose}
      AND expires_at > now() AND attempts < ${MAX_ATTEMPTS}
    RETURNING code_hash
  `;
  if (!row) return false;

  const expected = Buffer.from(row.code_hash, "hex");
  const actual = Buffer.from(hashCode(userId, purpose, code.trim()), "hex");
  if (!timingSafeEqual(actual, expected)) return false;

  await tx`
    DELETE FROM auth.one_time_codes
    WHERE user_id = ${userId} AND purpose = ${purpose}
  `;
  return true;
}

/**
 * Counts a hit against `key` in a fixed window and reports whether the caller
 * is still under `limit`. One INSERT … ON CONFLICT, for the same reason as
 * bump_rate_bucket: a read-then-write throttle races under exactly the
 * concurrent load it exists to stop.
 */
export async function underLimit(
  tx: Tx,
  key: string,
  limit: number,
  windowSeconds: number
): Promise<boolean> {
  const [row] = await tx<{ hits: number }[]>`
    WITH w AS (
      SELECT to_timestamp(
        floor(extract(epoch FROM now()) / ${windowSeconds}) * ${windowSeconds}
      ) AS start
    ), swept AS (
      DELETE FROM auth.rate_limits
      WHERE key = ${key} AND window_start < (SELECT start FROM w)
    )
    INSERT INTO auth.rate_limits (key, window_start, hits)
    SELECT ${key}, start, 1 FROM w
    ON CONFLICT (key, window_start)
    DO UPDATE SET hits = auth.rate_limits.hits + 1
    RETURNING hits
  `;
  return row.hits <= limit;
}

/** Addresses are compared lower-cased everywhere, starting with throttle keys. */
export function normalizeEmail(email: unknown): string {
  return String(email ?? "").trim().toLowerCase();
}
