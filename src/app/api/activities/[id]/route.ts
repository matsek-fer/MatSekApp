import { createClient as createServerClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";
import { pickActivityFields } from "@/lib/validation";
import type { ApiResponse, Activity } from "@/types";

/**
 * GET /api/activities/[id]
 *
 * Returns a single activity by ID.
 * Respects RLS: anonymous sees only approved; users see own + approved; admins see all.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();
    const { id } = params;

    const { data: activity, error } = await supabase
      .from("activities")
      .select("*, creator:profiles!created_by(id, email, full_name)")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Aktivnost nije pronađena." },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<Activity>>(
      { success: true, data: activity },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /api/activities/[id] error:", err);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/activities/[id]
 *
 * Update an activity. Only the creator can update and only if status is 'pending'.
 * Admins can update any activity.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();
    const { id } = params;

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

    // Fetch existing to check ownership
    const { data: existing } = await supabase
      .from("activities")
      .select("created_by, status")
      .eq("id", id)
      .single();

    if (!existing) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Aktivnost nije pronađena." },
        { status: 404 }
      );
    }

    // Check permissions via RLS (the update policy handles this, but we do
    // an early check for better error messages)
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    const isAdmin = profile?.role === "admin";
    const isOwner = session.user.id === existing.created_by;

    if (!isAdmin && !isOwner) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Nemaš dozvolu za uređivanje ove aktivnosti." },
        { status: 403 }
      );
    }

    if (!isAdmin && existing.status !== "pending") {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Možeš uređivati samo aktivnosti na čekanju.",
        },
        { status: 403 }
      );
    }

    // Never trust the body wholesale — `status`, `reviewed_by`, `admin_comment`
    // and friends are set by the approve/deny routes, not by the client.
    const patch = pickActivityFields(body);

    if (Object.keys(patch).length === 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Nema polja za ažuriranje." },
        { status: 400 }
      );
    }

    const { data: updated, error } = await supabase
      .from("activities")
      .update(patch)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json<ApiResponse<Activity>>(
      { success: true, data: updated },
      { status: 200 }
    );
  } catch (err) {
    console.error("PATCH /api/activities/[id] error:", err);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/activities/[id]
 *
 * Delete an activity. Only the creator can delete and only if status is 'pending'.
 * Admins can delete any.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();
    const { id } = params;

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Nisi prijavljen/a." },
        { status: 401 }
      );
    }

    // Check ownership / admin
    const { data: existing } = await supabase
      .from("activities")
      .select("created_by, status")
      .eq("id", id)
      .single();

    if (!existing) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Aktivnost nije pronađena." },
        { status: 404 }
      );
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    const isAdmin = profile?.role === "admin";

    if (!isAdmin && session.user.id !== existing.created_by) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Nemaš dozvolu." },
        { status: 403 }
      );
    }

    const { error } = await supabase
      .from("activities")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json<ApiResponse>(
      { success: true, data: { message: "Aktivnost obrisana." } },
      { status: 200 }
    );
  } catch (err) {
    console.error("DELETE /api/activities/[id] error:", err);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
