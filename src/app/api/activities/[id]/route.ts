import { NextResponse, type NextRequest } from "next/server";
import { withUser } from "@/lib/db";
import { loadActivity } from "@/lib/db/activities";
import { userFacingDbError } from "@/lib/db/errors";
import { getCurrentUser } from "@/lib/auth/session";
import {
  isActivityType,
  isReservationStatus,
  isUuid,
  pickActivityFields,
} from "@/lib/validation";
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
 * the URL of their download route, which checks the caller again.
 * Respects RLS: anonymous sees only approved; users see own + approved; admins see all.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const user = isUuid(id) ? await getCurrentUser() : null;
    const activity = isUuid(id)
      ? await withUser(user?.id ?? null, (tx) => loadActivity(tx, id))
      : null;

    if (!activity) {
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
    const { id } = await params;

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Nisi prijavljen/a." },
        { status: 401 }
      );
    }

    const body = await request.json();

    // The whole row, not just the owner: what it held before the edit is
    // what the admins are told it was changed from.
    const [existing] = isUuid(id)
      ? await withUser(user.id, (tx) =>
          tx<Activity[]>`SELECT * FROM activities WHERE id = ${id}`
        )
      : [];

    if (!existing) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Aktivnost nije pronađena." },
        { status: 404 }
      );
    }

    // The update policies decide this; checking first is for the message.
    const isAdmin = user.role === "admin";
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

    // An UPDATE that RLS refuses is not an error, it is an update of no
    // rows, so the empty result is checked below rather than caught here.
    let updated: Activity | undefined;
    try {
      [updated] = await withUser(user.id, (tx) =>
        tx<Activity[]>`UPDATE activities SET ${tx(patch)} WHERE id = ${id} RETURNING *`
      );
    } catch (err) {
      const message = userFacingDbError(err);
      if (!message) throw err;
      return NextResponse.json<ApiResponse>(
        { success: false, error: message },
        { status: 400 }
      );
    }
    if (!updated) {
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
            "Izmjena nije spremljena jer je baza nije dopustila. Aktivnost je možda u međuvremenu pregledana; ako nije, bazi nedostaju pravila za uređivanje odobrenih aktivnosti (db/schema.sql).",
        },
        { status: 403 }
      );
    }

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
            user.full_name,
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
    const { id } = await params;

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Nisi prijavljen/a." },
        { status: 401 }
      );
    }

    // Check ownership / admin
    const [existing] = isUuid(id)
      ? await withUser(user.id, (tx) =>
          tx<Pick<Activity, "created_by" | "status">[]>`
            SELECT created_by, status FROM activities WHERE id = ${id}
          `
        )
      : [];

    if (!existing) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Aktivnost nije pronađena." },
        { status: 404 }
      );
    }

    const isAdmin = user.role === "admin";

    if (!isAdmin && user.id !== existing.created_by) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Nemaš dozvolu." },
        { status: 403 }
      );
    }

    // The delete policy only lets an author remove a pending proposal.
    // Under Supabase a refused delete looked like success; counting rows
    // makes it an answer.
    const deleted = await withUser(user.id, (tx) =>
      tx`DELETE FROM activities WHERE id = ${id}`
    );

    if (deleted.count === 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Možeš obrisati samo aktivnosti na čekanju." },
        { status: 403 }
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
