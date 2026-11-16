import type { Tx } from "@/lib/db";

/**
 * A notification row plus `activity` as {id, title, status} — the shape of
 * Supabase's `activities(id, title, status)` embed, which Notification in
 * src/types describes. Selected FROM notifications n LEFT JOIN activities a;
 * the join runs under the caller's RLS, so an activity they may no longer
 * see comes back as null rather than leaking.
 */
export const NOTIFICATION_COLUMNS = (tx: Tx) => tx`
  n.*,
  CASE WHEN a.id IS NULL THEN NULL ELSE
    json_build_object('id', a.id, 'title', a.title, 'status', a.status)
  END AS activity
`;
