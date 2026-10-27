import type { AiProvider } from "@/lib/ai/types";

// ── Enums as string unions (mirroring PostgreSQL enums) ──────────────────

export type ActivityType =
  | "lecture"
  | "discussion"
  | "problem_solving_session"
  | "social"
  | "seminar";

export type ActivityStatus = "pending" | "approved" | "rejected";

export type UserRole = "user" | "admin";

export type DocumentKind = "pdf" | "markdown" | "text";

export type DocumentStatus = "uploading" | "extracting" | "ready" | "failed";

// ── Database row types ────────────────────────────────────────────────────

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

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
  creator?: Pick<Profile, "id" | "email" | "full_name">;
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

export interface Document {
  id: string;
  owner_id: string;
  title: string;
  kind: DocumentKind;
  status: DocumentStatus;
  storage_path: string;
  byte_size: number;
  page_count: number;
  block_count: number;
  error_message: string;
  created_at: string;
  updated_at: string;
}

/**
 * One extracted run of text. `block_index` is the document order and the
 * stable half of an anchor; `page` is 1 for Markdown and text, where it means
 * nothing, and the real page for a PDF.
 */
export interface DocumentBlock {
  id: string;
  document_id: string;
  page: number;
  block_index: number;
  text: string;
  created_at: string;
}

/**
 * One conversation about one document. Provider and model live here, not on
 * the message — a thread is one conversation with one assistant.
 */
export interface ChatThread {
  id: string;
  document_id: string;
  owner_id: string;
  title: string;
  provider: AiProvider;
  model: string;
  created_at: string;
  updated_at: string;
}

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  thread_id: string;
  role: ChatRole;
  body: string;
  /** DocumentAnchor as stored; null on follow-ups without a selection. */
  anchor: unknown | null;
  stopped_early: boolean;
  error_note: string;
  created_at: string;
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
 * browser PUTs the bytes to Storage itself, the same handshake as documents.
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

export interface CreateDocumentPayload {
  title: string;
  kind: DocumentKind;
}

/**
 * What `POST /api/documents` hands back. The browser PUTs the file to
 * `upload_url` itself — the bytes never pass through Next — and then calls
 * the ingest route, so it needs the signed URL and the row in one response.
 */
export interface CreateDocumentResult {
  document: Document;
  upload_url: string;
  upload_token: string;
  content_type: string;
}

export interface DocumentWithBlocks {
  document: Document;
  blocks: DocumentBlock[];
  /** Short-lived, minted per request; only present once the file is readable. */
  file_url: string | null;
}

export interface CreateThreadPayload {
  provider: AiProvider;
  model: string;
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

// ── AI assistant ──────────────────────────────────────────────────────────

export const AI_PROVIDER_LABELS: Record<AiProvider, string> = {
  anthropic: "Anthropic (Claude)",
  openai: "OpenAI (ChatGPT)",
  google: "Google (Gemini)",
  deepseek: "DeepSeek",
};

export const DOCUMENT_KIND_LABELS: Record<DocumentKind, string> = {
  pdf: "PDF",
  markdown: "Markdown",
  text: "Tekst",
};

export const DOCUMENT_STATUS_LABELS: Record<DocumentStatus, string> = {
  uploading: "Učitavanje",
  extracting: "Obrada",
  ready: "Spremno",
  failed: "Neuspjelo",
};

/**
 * The content type the browser sends with the signed upload. It is derived
 * from the kind we already validated rather than read off the `File`, because
 * the bucket matches on this exact string and browsers disagree about
 * Markdown — some send `text/markdown`, some `text/x-markdown`, some nothing.
 */
export const DOCUMENT_KIND_MIME: Record<DocumentKind, string> = {
  pdf: "application/pdf",
  markdown: "text/markdown",
  text: "text/plain",
};

export const DOCUMENT_KIND_EXTENSIONS: Record<DocumentKind, string> = {
  pdf: "pdf",
  markdown: "md",
  text: "txt",
};

/** Where a member goes to create a key, linked from the settings page. */
export const AI_PROVIDER_CONSOLE_URLS: Record<AiProvider, string> = {
  anthropic: "https://platform.claude.com/settings/keys",
  openai: "https://platform.openai.com/api-keys",
  google: "https://aistudio.google.com/apikey",
  deepseek: "https://platform.deepseek.com/api_keys",
};
