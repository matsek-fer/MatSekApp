import { createClient as createServerClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";
import {
  isActivityType,
  isReservationStatus,
  pickActivityFields,
} from "@/lib/validation";
import { withDownloadUrls } from "@/lib/activity-materials";
import {
  describeEdit,
  editNotice,
  hasChanges,
  notifyAdminsOfEdit,
} from "@/lib/activity-edits";
import type { ApiResponse, Activity } from "@/types";

/**
 * GET /api/activities/[id]
 *
 * Returns a single activity by ID, with its materials. File materials carry
 * a short-lived download URL minted under the caller's own permissions.
 * Respects RLS: anonymous sees only approved; users see own + approved; admins see all.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerClient();
    const { id } = await params;

    const { data: activity, error } = await supabase
      .from("activities")
      .select(
        "*, creator:profiles!created_by(id, full_name), materials:activity_materials(*)"
      )
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Aktivnost nije pronađena." },
        { status: 404 }
      );
    }

    const materials = await withDownloadUrls(supabase, activity.materials ?? []);

    return NextResponse.json<ApiResponse<Activity>>(
      { success: true, data: { ...activity, materials } },
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
 * Update an activity. Its author may, until it is rejected; admins always.
 *
 * An author's edit of a pending proposal simply goes through. On an approved
 * activity the database decides what the edit costs: a new time, place or
 * type puts it back to 'pending' — off the public calendar until an admin
 * approves it again — and anything else leaves it published. That rule is
 * the `settle_member_edit` trigger, not this handler, so the returned row's
 * `status` is how the caller learns which it was. Either way the admins get
 * a notification saying what changed.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerClient();
    const { id } = await params;

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

    // The whole row, not just the owner: what it held before the edit is
    // what the admins are told it was changed from.
    const { data: existingRow } = await supabase
      .from("activities")
      .select("*")
      .eq("id", id)
      .single();

    if (!existingRow) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Aktivnost nije pronađena." },
        { status: 404 }
      );
    }
    const existing = existingRow as Activity;

    // Check permissions via RLS (the update policy handles this, but we do
    // an early check for better error messages)
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, full_name")
      .eq("id", user.id)
      .single();

    const isAdmin = profile?.role === "admin";
    const isOwner = user.id === existing.created_by;

    if (!isAdmin && !isOwner) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Nemaš dozvolu za uređivanje ove aktivnosti." },
        { status: 403 }
      );
    }

    if (!isAdmin && existing.status === "rejected") {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Odbijenu aktivnost nije moguće uređivati." },
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

    for (const field of ["title", "location", "description"]) {
      const value = patch[field];
      if (value !== undefined && (typeof value !== "string" || !value.trim())) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: `Polje "${field}" ne može biti prazno.` },
          { status: 400 }
        );
      }
    }
    if (
      patch.activity_type !== undefined &&
      !isActivityType(patch.activity_type)
    ) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Nepoznata vrsta aktivnosti." },
        { status: 400 }
      );
    }
    if (
      patch.reservation_status !== undefined &&
      !isReservationStatus(patch.reservation_status)
    ) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Nepoznat status rezervacije." },
        { status: 400 }
      );
    }

    // maybeSingle, not single: an UPDATE that RLS refuses is not an error to
    // PostgREST, it is an update of no rows, and `single()` reports that as
    // "Cannot coerce the result to a single JSON object" — true, and no use
    // to the member reading it.
    const { data: updatedRow, error } = await supabase
      .from("activities")
      .update(patch)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    if (!updatedRow) {
      // The row was readable a moment ago and passed the checks above, so the
      // UPDATE policies turned it down. Either it was reviewed in between, or
      // the database predates the policy that lets an author edit an approved
      // activity — the reply names both, as the insert errors name theirs.
      console.error(
        `PATCH /api/activities/${id}: update matched no row (status ${existing.status}, admin ${isAdmin})`
      );
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error:
            "Izmjena nije spremljena jer je baza nije dopustila. Aktivnost je možda u međuvremenu pregledana; ako nije, bazi nedostaju pravila za uređivanje odobrenih aktivnosti (supabase/schema.sql).",
        },
        { status: 403 }
      );
    }
    const updated = updatedRow as Activity;

    // Only an author's edit of an approved activity is news to the admins:
    // a pending one is theirs to read in full when they review it, and an
    // admin's own edit needs no announcing. Compared against the stored row
    // rather than the request, so re-sending a value is not reported.
    if (!isAdmin && existing.status === "approved") {
      const summary = describeEdit(existing, updated);
      if (hasChanges(summary)) {
        await notifyAdminsOfEdit(
          id,
          editNotice(
            profile?.full_name ?? "",
            updated.title,
            summary,
            updated.status === "pending"
          )
        );
      }
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerClient();
    const { id } = await params;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
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
      .eq("id", user.id)
      .single();

    const isAdmin = profile?.role === "admin";

    if (!isAdmin && user.id !== existing.created_by) {
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
