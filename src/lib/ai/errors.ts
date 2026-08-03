/**
 * Provider failures, translated.
 *
 * Two rules hold everywhere in lib/ai:
 *
 * 1. A provider's own error text never reaches the browser. It is English, it
 *    leaks request details, and it can echo back prompt content — which here
 *    means the member's private document.
 * 2. A provider's error object never reaches the log. See redactError below.
 */

import type { AiProvider } from "@/lib/ai/types";

/** Carries a Croatian message the route can hand straight to the member. */
export class AiError extends Error {
  constructor(
    readonly userMessage: string,
    readonly status: number,
    readonly cause?: unknown
  ) {
    super(userMessage);
    this.name = "AiError";
  }
}

// ── Mapping ────────────────────────────────────────────────────────────────

const INVALID_KEY = "Tvoj API ključ nije prihvaćen. Provjeri ga u postavkama.";
const RATE_LIMITED =
  "Dosegnuo/la si ograničenje zahtjeva kod pružatelja. Pokušaj za koju minutu.";
const NO_CREDIT = "Račun kod pružatelja nema dostupnih sredstava.";
const TOO_LONG =
  "Odabrani ulomak je prevelik za odabrani model. Odaberi kraći dio.";
const REJECTED = "Zahtjev nije prihvaćen. Pokušaj s kraćim odabirom.";
const UNAVAILABLE =
  "Pružatelj usluge trenutno ne odgovara. Pokušaj ponovno za koji trenutak.";
const UNKNOWN = "Došlo je do greške. Pokušaj ponovno.";

/**
 * Reads the HTTP status off whatever the SDK threw.
 *
 * All three SDKs surface it, but under names that have moved between major
 * versions, so this checks the handful they use rather than matching on
 * message text — which is the thing that silently stops working when a
 * provider rewords an error.
 */
function statusOf(err: unknown): number | undefined {
  if (typeof err !== "object" || err === null) return undefined;
  const e = err as Record<string, unknown>;
  for (const key of ["status", "statusCode", "code"]) {
    const value = e[key];
    if (typeof value === "number") return value;
  }
  const response = e.response as Record<string, unknown> | undefined;
  if (response && typeof response.status === "number") return response.status;
  return undefined;
}

function isAbort(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    (err as { name?: string }).name === "AbortError"
  );
}

/** Converts anything a provider SDK threw into an AiError. */
export function toAiError(provider: AiProvider, err: unknown): AiError {
  if (err instanceof AiError) return err;

  // The member pressed "Zaustavi", or their tab went away. Not a failure.
  if (isAbort(err)) return new AiError("", 499, err);

  const status = statusOf(err);

  switch (status) {
    case 401:
    case 403:
      return new AiError(INVALID_KEY, 400, err);
    case 402:
      return new AiError(NO_CREDIT, 400, err);
    case 413:
      return new AiError(TOO_LONG, 400, err);
    case 429:
      return new AiError(RATE_LIMITED, 429, err);
    case 400:
      // A 400 is usually us, but the one a member can trigger by hand is an
      // over-long selection, so lead with the actionable reading.
      return new AiError(REJECTED, 400, err);
  }

  if (status !== undefined && status >= 500) {
    return new AiError(UNAVAILABLE, 502, err);
  }

  console.error(`AI provider error (${provider}):`, redactError(err));
  return new AiError(UNKNOWN, 500, err);
}

// ── Logging ────────────────────────────────────────────────────────────────

/**
 * Strips an error down to what is safe to write to the log.
 *
 * The house convention elsewhere is `console.error("<label> error:", err)` on
 * the whole object. That is unsafe here: provider SDKs hang the originating
 * request off the error, and the request carries the member's API key in an
 * `x-api-key` or `Authorization` header. Logging the raw object would write
 * other people's credentials to disk.
 *
 * So: lib/ai deviates from the convention deliberately. Every catch in this
 * module and in the AI routes logs redactError(err), never err.
 */
export function redactError(err: unknown): {
  name: string;
  status?: number;
  message: string;
} {
  if (typeof err !== "object" || err === null) {
    return { name: "Unknown", message: String(err) };
  }
  const e = err as { name?: string; message?: string };
  return {
    name: typeof e.name === "string" ? e.name : "Error",
    status: statusOf(err),
    message: typeof e.message === "string" ? e.message : "",
  };
}
