/**
 * Per-user throttles, backed by the atomic bucket functions in the schema.
 *
 * Each check is one rpc — one INSERT .. ON CONFLICT .. RETURNING in the
 * database — so two simultaneous requests cannot both slip under a limit.
 * The functions read auth.uid() themselves; a member can only ever spend
 * their own budget, and these helpers can only be called with the RLS
 * client, never the admin one.
 *
 * `key_verify` is the one to treat as a security control rather than a cost
 * control: an unthrottled validation endpoint is a free oracle for testing
 * stolen API keys against providers.
 */

import type { createClient } from "@/lib/supabase/server";

type RlsClient = ReturnType<typeof createClient>;

interface ThrottleRule {
  scope: string;
  windowSeconds: number;
  limit: number;
  /** Shown to the member on refusal, so it names the wait. */
  message: string;
}

export const THROTTLES = {
  chatMinute: {
    scope: "chat_minute",
    windowSeconds: 60,
    limit: 10,
    message: "Prebrzo šalješ upite. Pričekaj minutu.",
  },
  chatDay: {
    scope: "chat_day",
    windowSeconds: 86_400,
    limit: 200,
    message: "Dosegnut je dnevni broj upita. Nastavi sutra.",
  },
  keyVerify: {
    scope: "key_verify",
    windowSeconds: 3_600,
    limit: 5,
    message: "Previše provjera ključa u kratkom vremenu. Pokušaj za sat vremena.",
  },
  upload: {
    scope: "upload",
    windowSeconds: 3_600,
    limit: 10,
    message: "Previše učitavanja u kratkom vremenu. Pokušaj za sat vremena.",
  },
} as const satisfies Record<string, ThrottleRule>;

export const MAX_DOCUMENTS_PER_USER = 50;

export const STREAM_BUSY_MESSAGE =
  "Već imaš odgovor u tijeku. Pričekaj ga ili ga zaustavi.";

/**
 * Counts this request against a rule. Returns the Croatian refusal when the
 * limit is exceeded, null when the request may proceed.
 *
 * Fails CLOSED: if the bucket rpc itself errors, the request is refused.
 * A throttle that fails open stops being a security control exactly when
 * the database is under enough pressure for it to matter.
 */
export async function checkThrottle(
  supabase: RlsClient,
  rule: ThrottleRule
): Promise<string | null> {
  const { data: hits, error } = await supabase.rpc("bump_rate_bucket", {
    p_scope: rule.scope,
    p_window_seconds: rule.windowSeconds,
  });

  if (error || typeof hits !== "number") {
    console.error(`throttle ${rule.scope} error:`, error);
    return "Zahtjev trenutno nije moguće obraditi. Pokušaj ponovno.";
  }

  return hits > rule.limit ? rule.message : null;
}

/** True when the caller may start streaming; false while one is running. */
export async function acquireStreamSlot(supabase: RlsClient): Promise<boolean> {
  const { data, error } = await supabase.rpc("acquire_stream_slot");
  if (error) {
    console.error("acquire_stream_slot error:", error);
    return false;
  }
  return data === true;
}

/** Always safe to call; the slot floors at zero. */
export async function releaseStreamSlot(supabase: RlsClient): Promise<void> {
  const { error } = await supabase.rpc("release_stream_slot");
  if (error) console.error("release_stream_slot error:", error);
}
