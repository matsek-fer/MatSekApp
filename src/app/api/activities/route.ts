import { createClient as createServerClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";
import { isActivityStatus, isUuid, pickActivityFields } from "@/lib/validation";
import type { ApiResponse, Activity } from "@/types";

/**
 * GET /api/activities
 *
 * Query params:
 *   ?status=pending|approved|rejected  (default: approved for public)
 *   ?limit=50
 *
 * Public: only approved.
 * Authenticated: own + all approved.
 * Admin: all.
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get("limit")) || 50, 200);

    // `status` is interpolated into a PostgREST filter expression below, so it
    // has to be one of the known enum values — never raw user input.
    const rawStatus = searchParams.get("status");
    if (rawStatus !== null && !isActivityStatus(rawStatus)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Nepoznat status." },
        { status: 400 }
      );
    }
    const status = rawStatus ?? undefined;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    let query = supabase
      .from("activities")
      .select("*, creator:profiles!created_by(id, full_name)")
      .order("start_time", { ascending: true })
      .limit(limit);

    if (user) {
      // The id is about to be interpolated into a filter; see isUuid().
      if (!isUuid(user.id)) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: "Neispravna sesija." },
          { status: 401 }
        );
      }
      // Check if admin
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role === "admin") {
        // Admin sees everything; optional status filter
        if (status) {
          query = query.eq("status", status);
        }
      } else {
        // Regular user: approved + own
        if (status) {
          query = query.or(
            `status.eq.${status},and(created_by.eq.${user.id},status.eq.${status})`
          );
        } else {
          query = query.or(
            `status.eq.approved,created_by.eq.${user.id}`
          );
        }
      }
    } else {
      // Anonymous: only approved
      query = query.eq("status", "approved");
    }

    const { data: activities, error } = await query;

    if (error) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<Activity[]>>(
      { success: true, data: activities },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /api/activities error:", err);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/activities
 *
 * Body: CreateActivityPayload
 *
 * Creates a new activity with status = 'pending'.
 * Requires authentication.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Nisi prijavljen/a." },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate required fields
    const required = [
      "title",
      "activity_type",
      "start_time",
      "end_time",
      "location",
      "description",
    ];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: `Polje "${field}" je obavezno.` },
          { status: 400 }
        );
      }
    }

    const { data: activity, error } = await supabase
      .from("activities")
      .insert({
        ...pickActivityFields(body),
        prerequisites: body.prerequisites || "",
        target_audience: body.target_audience || "",
        // Server-owned: a proposal always starts unreviewed.
        created_by: user.id,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json<ApiResponse<Activity>>(
      { success: true, data: activity },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/activities error:", err);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
