import { NextResponse, type NextRequest } from "next/server";
import { withUser } from "@/lib/db";
import { NOTIFICATION_COLUMNS } from "@/lib/db/notifications";
import { getCurrentUser } from "@/lib/auth/session";
import { isUuid } from "@/lib/validation";
import type { ApiResponse, Notification } from "@/types";

/**
 * GET /api/notifications
 *
 * Returns notifications for the authenticated user.
 * Query params:
 *   ?unread_only=true  — only unread
 *   ?limit=50
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Nisi prijavljen/a." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get("unread_only") === "true";
    const limit = Math.min(Number(searchParams.get("limit")) || 50, 200);

    const notifications = await withUser(user.id, (tx) =>
      tx<Notification[]>`
        SELECT ${NOTIFICATION_COLUMNS(tx)}
        FROM notifications n
        LEFT JOIN activities a ON a.id = n.activity_id
        WHERE n.user_id = ${user.id}
          ${unreadOnly ? tx`AND n.is_read = false` : tx``}
        ORDER BY n.created_at DESC
        LIMIT ${limit}
      `
    );

    return NextResponse.json<ApiResponse<Notification[]>>(
      { success: true, data: notifications },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /api/notifications error:", err);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/notifications
 *
 * Body: { notification_ids: string[] } — marks them as read.
 * Or: { mark_all_read: true } — marks all as read.
 */
export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Nisi prijavljen/a." },
        { status: 401 }
      );
    }

    const body = await request.json();

    if (body.mark_all_read) {
      await withUser(user.id, (tx) =>
        tx`
          UPDATE notifications SET is_read = true
          WHERE user_id = ${user.id} AND is_read = false
        `
      );
    } else if (Array.isArray(body.notification_ids)) {
      const ids = body.notification_ids.filter(isUuid);
      if (ids.length > 0) {
        await withUser(user.id, (tx) =>
          tx`
            UPDATE notifications SET is_read = true
            WHERE id IN ${tx(ids)} AND user_id = ${user.id}
          `
        );
      }
    } else {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Pošalji notification_ids ili mark_all_read." },
        { status: 400 }
      );
    }

    return NextResponse.json<ApiResponse>(
      { success: true, data: { message: "Notifikacije ažurirane." } },
      { status: 200 }
    );
  } catch (err) {
    console.error("PATCH /api/notifications error:", err);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
