import type { ActivityStatus, ActivityType } from "@/types";

/**
 * Registration is restricted to faculty addresses. Enforced for real by the
 * `restrict_email_domain` trigger in the database — this copy exists so the
 * form can fail fast with a friendly message.
 */
export const ALLOWED_EMAIL_DOMAINS = ["@fer.hr", "@student.fer.hr"] as const;

export function isAllowedEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  return ALLOWED_EMAIL_DOMAINS.some((domain) => normalized.endsWith(domain));
}

const ACTIVITY_STATUSES: ActivityStatus[] = ["pending", "approved", "rejected"];
const ACTIVITY_TYPES: ActivityType[] = [
  "lecture",
  "discussion",
  "problem_solving_session",
];

/**
 * The session cookie is parsed, not verified, before it reaches a handler:
 * `session.user.id` is whatever the cookie says. RLS confines what such a
 * token can read, but an id that is interpolated into a PostgREST filter
 * string must at least be a UUID, or the filter grammar is in the caller's
 * hands.
 */
export function isUuid(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
  );
}

export function isActivityStatus(value: unknown): value is ActivityStatus {
  return ACTIVITY_STATUSES.includes(value as ActivityStatus);
}

export function isActivityType(value: unknown): value is ActivityType {
  return ACTIVITY_TYPES.includes(value as ActivityType);
}

/** Columns a client is allowed to write. Everything else is server-owned. */
export const ACTIVITY_WRITABLE_FIELDS = [
  "title",
  "activity_type",
  "start_time",
  "end_time",
  "location",
  "description",
  "prerequisites",
  "target_audience",
] as const;

/**
 * Strips server-owned columns (`status`, `reviewed_by`, `admin_comment`, …)
 * out of a request body before it reaches the database.
 */
export function pickActivityFields(
  body: Record<string, unknown>
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const field of ACTIVITY_WRITABLE_FIELDS) {
    if (body[field] !== undefined) out[field] = body[field];
  }
  return out;
}
