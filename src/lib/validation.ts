import type {
  ActivityMaterialInput,
  ActivityMaterialKind,
  ActivityMaterialPhase,
  ActivityStatus,
  ActivityType,
} from "@/types";
import { ACTIVITY_MATERIAL_MIME_BY_EXTENSION } from "@/types";

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
  "social",
  "seminar",
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

// ── Activity materials ─────────────────────────────────────────────────────

const ACTIVITY_MATERIAL_PHASES: ActivityMaterialPhase[] = ["before", "during"];
const ACTIVITY_MATERIAL_KINDS: ActivityMaterialKind[] = [
  "library",
  "link",
  "file",
];

export function isActivityMaterialPhase(
  value: unknown
): value is ActivityMaterialPhase {
  return ACTIVITY_MATERIAL_PHASES.includes(value as ActivityMaterialPhase);
}

export function isActivityMaterialKind(
  value: unknown
): value is ActivityMaterialKind {
  return ACTIVITY_MATERIAL_KINDS.includes(value as ActivityMaterialKind);
}

/** Enough for a reading list, few enough that the activity page stays a page. */
export const MAX_ACTIVITY_MATERIALS = 20;

export const MAX_ACTIVITY_MATERIAL_TITLE_LENGTH = 200;

/** Mirrors `file_size_limit` on the `activity-materials` bucket. */
export const MAX_ACTIVITY_MATERIAL_BYTES = 26_214_400; // 25 MiB

const ACTIVITY_MATERIAL_MIMES = new Set(
  Object.values(ACTIVITY_MATERIAL_MIME_BY_EXTENSION)
);

/**
 * A link material becomes an `href` on a public page, so only http(s) is
 * accepted — never `javascript:` or a bare path a browser would resolve
 * against this site. Library materials additionally may point back under
 * `/materials/…`: a topic page, or a file the site hosts there (the
 * topology script); `..` is refused so the path cannot climb out.
 */
export function isMaterialUrl(value: unknown, allowInternal = false): value is string {
  if (typeof value !== "string") return false;
  const v = value.trim();
  if (
    allowInternal &&
    /^\/materials\/[A-Za-z0-9._\/-]+(#[A-Za-z0-9-]+)?$/.test(v) &&
    !v.includes("..")
  ) {
    return true;
  }
  try {
    const u = new URL(v);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Checks one material as the form sent it and returns the row-shaped
 * fields, or the Croatian reason it was refused. Server-owned columns
 * (`storage_path`, `activity_id`) are never read from the input.
 */
export function parseActivityMaterial(
  raw: unknown,
  index: number
): { ok: true; material: ActivityMaterialInput } | { ok: false; error: string } {
  if (!raw || typeof raw !== "object") {
    return { ok: false, error: "Materijal nije ispravno zadan." };
  }
  const m = raw as Record<string, unknown>;

  if (!isActivityMaterialPhase(m.phase)) {
    return { ok: false, error: "Nepoznata faza materijala." };
  }
  if (!isActivityMaterialKind(m.kind)) {
    return { ok: false, error: "Nepoznata vrsta materijala." };
  }

  const title = typeof m.title === "string" ? m.title.trim() : "";
  if (!title) {
    return { ok: false, error: "Svaki materijal treba naslov." };
  }
  if (title.length > MAX_ACTIVITY_MATERIAL_TITLE_LENGTH) {
    return { ok: false, error: `Naslov materijala „${title.slice(0, 40)}…” je predug.` };
  }

  const note = typeof m.note === "string" ? m.note.trim().slice(0, 200) : "";
  const position =
    typeof m.position === "number" && Number.isFinite(m.position)
      ? Math.max(0, Math.floor(m.position))
      : index;

  if (m.kind === "file") {
    const fileName = typeof m.file_name === "string" ? m.file_name.trim() : "";
    const contentType =
      typeof m.content_type === "string" ? m.content_type.trim() : "";
    const byteSize =
      typeof m.byte_size === "number" && Number.isFinite(m.byte_size)
        ? Math.max(0, Math.floor(m.byte_size))
        : 0;
    if (!fileName) {
      return { ok: false, error: "Datoteka treba ime." };
    }
    if (!ACTIVITY_MATERIAL_MIMES.has(contentType)) {
      return { ok: false, error: "Podržani su PDF, Markdown i tekstualne datoteke." };
    }
    if (byteSize > MAX_ACTIVITY_MATERIAL_BYTES) {
      return { ok: false, error: `Datoteka „${fileName}” je veća od 25 MB.` };
    }
    return {
      ok: true,
      material: {
        phase: m.phase,
        kind: "file",
        title,
        note,
        position,
        file_name: fileName,
        content_type: contentType,
        byte_size: byteSize,
      },
    };
  }

  if (!isMaterialUrl(m.url, m.kind === "library")) {
    return {
      ok: false,
      error: `Poveznica za „${title}” nije ispravna (treba počinjati s http:// ili https://).`,
    };
  }

  return {
    ok: true,
    material: {
      phase: m.phase,
      kind: m.kind,
      title,
      url: (m.url as string).trim(),
      note,
      position,
    },
  };
}

/** Sanitises a user's file name into a single safe path segment. */
export function safeFileName(name: string): string {
  const base = name.split(/[\\/]/).pop() ?? "file";
  const cleaned = base.replace(/[^A-Za-z0-9._-]+/g, "_").replace(/^\.+/, "");
  return (cleaned || "file").slice(0, 120);
}
