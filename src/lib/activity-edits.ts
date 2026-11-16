import { format, parseISO } from "date-fns";
import { hr } from "date-fns/locale";
import { createAdminClient } from "@/lib/supabase/server";
import {
  ACTIVITY_TYPE_LABELS,
  RESERVATION_STATUS_LABELS,
  type Activity,
} from "@/types";

/**
 * Telling the admins that a member changed an activity they had already
 * approved.
 *
 * Whether such an edit stays public or goes back for review is not decided
 * here — the `settle_member_edit` trigger in schema.sql does that, for the
 * API and for a token used against PostgREST directly alike. This module
 * only words what happened and leaves it in the admins' notifications.
 */

type EditableFields = Pick<
  Activity,
  | "title"
  | "activity_type"
  | "start_time"
  | "end_time"
  | "location"
  | "reservation_status"
  | "description"
  | "prerequisites"
  | "target_audience"
>;

export interface EditSummary {
  /** Changes to when, where or what kind — each with the old and new value. */
  reviewed: string[];
  /** Everything else, by name. */
  other: string[];
}

const day = (iso: string) => format(parseISO(iso), "dd.MM.yyyy.", { locale: hr });
const hour = (iso: string) => format(parseISO(iso), "HH:mm");
const span = (a: EditableFields) =>
  `${day(a.start_time)} ${hour(a.start_time)}–${hour(a.end_time)}`;

/** Postgres and the browser spell the same instant differently. */
const sameInstant = (a: string, b: string) =>
  new Date(a).getTime() === new Date(b).getTime();

/**
 * What differs between a row before and after an edit. The reviewed fields
 * carry both values, because the admin is being asked to agree to the new
 * one; the rest are only named, since the activity page shows them.
 */
export function describeEdit(
  before: EditableFields,
  after: EditableFields
): EditSummary {
  const reviewed: string[] = [];
  if (
    !sameInstant(before.start_time, after.start_time) ||
    !sameInstant(before.end_time, after.end_time)
  ) {
    reviewed.push(`termin ${span(before)} → ${span(after)}`);
  }
  if (before.location !== after.location) {
    reviewed.push(`mjesto „${before.location}” → „${after.location}”`);
  }
  if (before.activity_type !== after.activity_type) {
    reviewed.push(
      `vrsta ${ACTIVITY_TYPE_LABELS[before.activity_type]} → ${ACTIVITY_TYPE_LABELS[after.activity_type]}`
    );
  }

  const other: string[] = [];
  if (before.title !== after.title) other.push(`naslov (prije „${before.title}”)`);
  if (before.description !== after.description) other.push("opis");
  if (before.prerequisites !== after.prerequisites) other.push("preduvjeti");
  if (before.target_audience !== after.target_audience) {
    other.push("ciljana publika");
  }
  if (before.reservation_status !== after.reservation_status) {
    other.push(
      `${RESERVATION_STATUS_LABELS[before.reservation_status].toLowerCase()} → ${RESERVATION_STATUS_LABELS[after.reservation_status].toLowerCase()}`
    );
  }

  return { reviewed, other };
}

export function hasChanges(summary: EditSummary): boolean {
  return summary.reviewed.length + summary.other.length > 0;
}

/** The notification for an edit of the activity's own fields. */
export function editNotice(
  who: string,
  title: string,
  summary: EditSummary,
  backInReview: boolean
): string {
  const changes = [...summary.reviewed, ...summary.other].join("; ");
  return (
    `${who || "Član"} je izmijenio/la odobrenu aktivnost „${title}”: ${changes}. ` +
    (backInReview
      ? "Povučena je s kalendara dok je ponovno ne odobriš."
      : "Ostaje objavljena.")
  );
}

/** The notification for a material added to or removed from an approved activity. */
export function materialNotice(
  who: string,
  activityTitle: string,
  materialTitle: string,
  change: "added" | "removed"
): string {
  return (
    `${who || "Član"} je ${change === "added" ? "dodao/la" : "uklonio/la"} materijal ` +
    `„${materialTitle}” ${change === "added" ? "odobrenoj aktivnosti" : "s odobrene aktivnosti"} ` +
    `„${activityTitle}”. Ostaje objavljena.`
  );
}

/** Lines pile up on one unread note; past this the oldest are dropped. */
const MAX_NOTE_LENGTH = 1500;

/**
 * Leaves `line` with every admin, on one unread note per admin and
 * activity. A save from the edit form is several requests — the fields,
 * then each material and file — and five notifications for one save would
 * teach the admins to stop reading them, so a line joins the note that is
 * still unread and only starts a new one once that has been read.
 *
 * The service-role client is used for the reason it exists: a member cannot
 * insert a notification for someone else. The caller has already let the
 * edit through RLS as that member; nothing here reads or returns data on
 * their behalf. A failure is logged and swallowed — the edit is saved
 * either way, and an activity sent back for review shows in the admin
 * queue whether or not the note arrived.
 */
export async function notifyAdminsOfEdit(
  activityId: string,
  line: string
): Promise<void> {
  try {
    const admin = createAdminClient();

    const { data: admins, error: adminsError } = await admin
      .from("profiles")
      .select("id")
      .eq("role", "admin");
    if (adminsError) throw adminsError;
    const adminIds = (admins ?? []).map((a) => a.id as string);
    if (adminIds.length === 0) return;

    const { data: unread, error: unreadError } = await admin
      .from("notifications")
      .select("id, user_id, message")
      .eq("activity_id", activityId)
      .eq("type", "edited")
      .eq("is_read", false)
      .in("user_id", adminIds);
    if (unreadError) throw unreadError;

    const open = new Map(
      (unread ?? []).map((n) => [n.user_id as string, n] as const)
    );

    const fresh = adminIds
      .filter((id) => !open.has(id))
      .map((user_id) => ({
        user_id,
        activity_id: activityId,
        type: "edited",
        message: line,
      }));
    if (fresh.length > 0) {
      const { error } = await admin.from("notifications").insert(fresh);
      if (error) throw error;
    }

    // Stamped now, so the note rises back to the top of the bell.
    const now = new Date().toISOString();
    await Promise.all(
      [...open.values()].map((n) => {
        const merged = `${n.message}\n${line}`;
        return admin
          .from("notifications")
          .update({
            message:
              merged.length > MAX_NOTE_LENGTH
                ? `…${merged.slice(-MAX_NOTE_LENGTH)}`
                : merged,
            created_at: now,
          })
          .eq("id", n.id);
      })
    );
  } catch (err) {
    console.error("notifyAdminsOfEdit failed:", err);
  }
}
