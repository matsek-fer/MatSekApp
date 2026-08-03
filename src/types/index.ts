import type { AiProvider } from "@/lib/ai/types";

// ── Enums as string unions (mirroring PostgreSQL enums) ──────────────────

export type ActivityType =
  | "lecture"
  | "discussion"
  | "problem_solving_session";

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
};

/** Where a member goes to create a key, linked from the settings page. */
export const AI_PROVIDER_CONSOLE_URLS: Record<AiProvider, string> = {
  anthropic: "https://platform.claude.com/settings/keys",
  openai: "https://platform.openai.com/api-keys",
  google: "https://aistudio.google.com/apikey",
};
