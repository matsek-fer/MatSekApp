// ── Enums as string unions (mirroring PostgreSQL enums) ──────────────────

export type ActivityType =
  | "lecture"
  | "discussion"
  | "problem_solving_session"
  | "social"
  | "seminar";

export type ActivityStatus = "pending" | "approved" | "rejected";

export type UserRole = "user" | "admin";

// ── Database row types ────────────────────────────────────────────────────

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

/** What approve/deny return: the row plus whether the proposer was emailed. */
export type ReviewResult = Activity & { email_sent: boolean };

export interface Activity {
  id: string;
  created_by: string;
  title: string;
  activity_type: ActivityType;
  start_time: string; // ISO 8601
  end_time: string; // ISO 8601
  location: string;
  description: string;
  prerequisites: string;
  target_audience: string;
  status: ActivityStatus;
  admin_comment: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;

  // Joined fields (not in DB)
  /** Embedded by the API — the name only; nobody reads another member's e-mail. */
  creator?: Pick<Profile, "id" | "full_name">;
  materials?: ActivityMaterial[];
}

/**
 * When a participant is meant to open a material: `before` is homework for
 * the session, `during` is what the session itself works through or what
 * to read afterwards. Two lists on the activity page, not one with tags.
 */
export type ActivityMaterialPhase = "before" | "during";

/**
 * `library` points into the Materials pages (a topic or one of its books),
 * `link` is any URL the proposer pasted, `file` is a document they uploaded
 * to Storage — the only kind that needs a signed URL to open.
 */
export type ActivityMaterialKind = "library" | "link" | "file";

export interface ActivityMaterial {
  id: string;
  activity_id: string;
  phase: ActivityMaterialPhase;
  kind: ActivityMaterialKind;
  title: string;
  /** Where a library or link material goes; empty for a file. */
  url: string;
  /** Secondary line — the library topic a book belongs to. */
  note: string;
  storage_path: string;
  file_name: string;
  content_type: string;
  byte_size: number;
  position: number;
  created_at: string;

  /** Minted per request for files; never stored. */
  download_url?: string | null;
}

export interface Notification {
  id: string;
  user_id: string;
  activity_id: string | null;
  type: "approved" | "rejected" | "info";
  message: string;
  is_read: boolean;
  created_at: string;

  // Joined
  activity?: Pick<Activity, "id" | "title" | "status">;
}

// ── API request / response types ──────────────────────────────────────────

export interface CreateActivityPayload {
  title: string;
  activity_type: ActivityType;
  start_time: string;
  end_time: string;
  location: string;
  description: string;
  prerequisites: string;
  target_audience: string;
  /** Library and link materials only; files are attached after creation. */
  materials?: ActivityMaterialInput[];
}

/** One material as the proposal form sends it. */
export interface ActivityMaterialInput {
  phase: ActivityMaterialPhase;
  kind: ActivityMaterialKind;
  title: string;
  url?: string;
  note?: string;
  position?: number;
  /** File kind only: the browser's name and type for the upload. */
  file_name?: string;
  content_type?: string;
  byte_size?: number;
}

/**
 * What `POST /api/activities/[id]/materials` hands back for a file. The
 * browser PUTs the bytes to Storage itself on the signed URL.
 */
export interface CreateActivityMaterialResult {
  material: ActivityMaterial;
  upload_url: string | null;
  upload_token: string | null;
}

export interface UpdateActivityPayload extends Partial<CreateActivityPayload> {}

export interface DenyActivityPayload {
  admin_comment: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  full_name: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// ── Activity type display helpers ─────────────────────────────────────────

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  lecture: "Predavanje",
  discussion: "Diskusija",
  problem_solving_session: "Problemska sesija",
  social: "Druženje",
  seminar: "Seminar",
};

export const ACTIVITY_MATERIAL_PHASE_LABELS: Record<
  ActivityMaterialPhase,
  { label: string; hint: string }
> = {
  before: {
    label: "Za pripremu",
    hint: "Što sudionici trebaju proći prije dolaska.",
  },
  during: {
    label: "Uz aktivnost i za nastavak",
    hint: "Što se obrađuje na samoj aktivnosti ili služi za produbljivanje poslije.",
  },
};

export const ACTIVITY_MATERIAL_KIND_LABELS: Record<ActivityMaterialKind, string> = {
  library: "Knjižnica",
  link: "Poveznica",
  file: "Datoteka",
};

/**
 * What an uploaded activity material may be. The `activity-materials`
 * bucket enforces the same list; this copy lets the form refuse a file
 * before the upload starts.
 */
export const ACTIVITY_MATERIAL_MIME_BY_EXTENSION: Record<string, string> = {
  pdf: "application/pdf",
  md: "text/markdown",
  markdown: "text/markdown",
  txt: "text/plain",
};

export const ACTIVITY_STATUS_LABELS: Record<ActivityStatus, string> = {
  pending: "Na čekanju",
  approved: "Odobreno",
  rejected: "Odbijeno",
};

// Status colours live with the component that renders them:
// see `StatusBadge` in src/components/ui/Badge.tsx.
