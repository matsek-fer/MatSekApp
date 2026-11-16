import { NextResponse } from "next/server";
import { withUser } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import type { ApiResponse } from "@/types";

export const dynamic = "force-dynamic";

const PREVIEW_LIMIT = 10;

export interface UnreadSummary {
  items: {
    id: string;
    type: string;
    message: string;
    created_at: string;
    activity_id: string | null;
  }[];
  /** The true unread total — the badge must not stop at PREVIEW_LIMIT. */
  total: number;
}

/**
 * GET /api/notifications/unread
 *
 * What the navbar bell polls: the newest unread notifications plus the full
 * unread count, in one request. The bell used to ask the database for these
 * two itself, from the browser; with no browser-reachable database that has
 * to be a route.
 */
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Nisi prijavljen/a." },
        { status: 401 }
      );
    }

    const [items, [{ total }]] = await withUser(user.id, (tx) =>
      Promise.all([
        tx<UnreadSummary["items"]>`
          SELECT id, type, message, created_at, activity_id
          FROM notifications
          WHERE user_id = ${user.id} AND is_read = false
          ORDER BY created_at DESC
          LIMIT ${PREVIEW_LIMIT}
        `,
        tx<{ total: number }[]>`
          SELECT count(*)::int AS total
          FROM notifications
          WHERE user_id = ${user.id} AND is_read = false
        `,
      ])
    );

    return NextResponse.json<ApiResponse<UnreadSummary>>({
      success: true,
      data: { items: [...items], total },
    });
  } catch (err) {
    console.error("GET /api/notifications/unread error:", err);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
