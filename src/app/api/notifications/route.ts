import { createClient as createServerClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";
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
    const supabase = createServerClient();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Nisi prijavljen/a." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const unreadOnly = searchParams.get("unread_only") === "true";
    const limit = Math.min(Number(searchParams.get("limit")) || 50, 200);

    let query = supabase
      .from("notifications")
      .select("*, activity:activities(id, title, status)")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (unreadOnly) {
      query = query.eq("is_read", false);
    }

    const { data: notifications, error } = await query;

    if (error) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

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
    const supabase = createServerClient();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Nisi prijavljen/a." },
        { status: 401 }
      );
    }

    const body = await request.json();

    if (body.mark_all_read) {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", session.user.id)
        .eq("is_read", false);

      if (error) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: error.message },
          { status: 500 }
        );
      }
    } else if (Array.isArray(body.notification_ids)) {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .in("id", body.notification_ids)
        .eq("user_id", session.user.id);

      if (error) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: error.message },
          { status: 500 }
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
