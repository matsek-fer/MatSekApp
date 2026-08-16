import type { ActivityStatus, ActivityType, DocumentKind } from "@/types";
import type { AiProvider } from "@/lib/ai/types";

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

export function isActivityStatus(value: unknown): value is ActivityStatus {
  return ACTIVITY_STATUSES.includes(value as ActivityStatus);
}

export function isActivityType(value: unknown): value is ActivityType {
  return ACTIVITY_TYPES.includes(value as ActivityType);
}

// ── AI assistant ───────────────────────────────────────────────────────────

const AI_PROVIDER_VALUES: AiProvider[] = [
  "anthropic",
  "openai",
  "google",
  "deepseek",
];

/**
 * The provider arrives in a route path and picks which cookie is read and
 * which vendor SDK is constructed, so it is checked before it is used — the
 * same reason `status` is checked in the activities route.
 */
export function isAiProvider(value: unknown): value is AiProvider {
  return AI_PROVIDER_VALUES.includes(value as AiProvider);
}

/**
 * Longest key any provider currently issues, with room to spare. A bound on
 * what we are willing to seal, so a large body cannot be smuggled in as a key.
 */
export const MAX_API_KEY_LENGTH = 512;

// ── Documents ──────────────────────────────────────────────────────────────

const DOCUMENT_KINDS: DocumentKind[] = ["pdf", "markdown", "text"];

/**
 * The kind decides which extractor runs and which extension the object is
 * stored under, so it is checked before either — same reason `status` is
 * checked before it reaches a PostgREST filter.
 */
export function isDocumentKind(value: unknown): value is DocumentKind {
  return DOCUMENT_KINDS.includes(value as DocumentKind);
}

export const MAX_DOCUMENT_TITLE_LENGTH = 200;

/**
 * Mirrors `file_size_limit` on the `documents` bucket. The bucket is what
 * actually enforces this — the browser uploads straight to Storage — so this
 * copy exists only to fail fast with a Croatian message instead of letting
 * the member wait through a doomed upload.
 */
export const MAX_DOCUMENT_BYTES = 26_214_400; // 25 MiB

/**
 * A ceiling on extraction, not on what a member may upload. A pathological
 * PDF can hold tens of thousands of tiny text runs, and every one of them
 * would become a row and a rendered element.
 */
export const MAX_DOCUMENT_BLOCKS = 20_000;

/** Extraction runs inline in a route handler, so it has to end. */
export const MAX_DOCUMENT_PAGES = 500;

// ── Chat ───────────────────────────────────────────────────────────────────

/** Bound on the <task> slot — a question, not an essay. */
export const MAX_QUESTION_LENGTH = 2_000;

/**
 * Bound on the resolved excerpt in UTF-16 code units. Excerpts are resolved
 * server-side from anchors, so this caps what a sweep-everything selection
 * can push into a prompt — and into the member's own bill.
 */
export const MAX_EXCERPT_LENGTH = 8_000;

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
