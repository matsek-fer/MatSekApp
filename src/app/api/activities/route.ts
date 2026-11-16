import { NextResponse, type NextRequest } from "next/server";
import { withUser } from "@/lib/db";
import { userFacingDbError } from "@/lib/db/errors";
import { getCurrentUser } from "@/lib/auth/session";
import {
  isActivityStatus,
  isReservationStatus,
  MAX_ACTIVITY_MATERIALS,
  parseActivityMaterial,
  pickActivityFields,
} from "@/lib/validation";
import type { ActivityMaterialInput, ApiResponse, Activity } from "@/types";

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
    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get("limit")) || 50, 200);

    // Checked against the enum so an unknown value is a 400 rather than a
    // Postgres cast error.
    const rawStatus = searchParams.get("status");
    if (rawStatus !== null && !isActivityStatus(rawStatus)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Nepoznat status." },
        { status: 400 }
      );
    }
    const status = rawStatus ?? null;

    const user = await getCurrentUser();

    const activities = await withUser(user?.id ?? null, (tx) => {
      // RLS already limits a member to approved rows plus their own; the
      // visibility filter is spelled out anyway so the query reads as what it
      // returns.
      const visible =
        user?.role === "admin"
          ? tx`TRUE`
          : user
            ? tx`(status = 'approved' OR created_by = ${user.id})`
            : tx`status = 'approved'`;
      const byStatus = status ? tx`AND status = ${status}` : tx``;

      return tx<Activity[]>`
        SELECT * FROM activities_with_creator
        WHERE ${visible} ${byStatus}
        ORDER BY start_time ASC
        LIMIT ${limit}
      `;
    });

    return NextResponse.json<ApiResponse<Activity[]>>(
      { success: true, data: [...activities] },
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
 * Creates a new activity with status = 'pending', plus its link and library
 * materials. File materials are not accepted here: a file needs the
 * activity's id for its storage path, so the form attaches them afterwards
 * through /api/activities/[id]/materials.
 * Requires authentication.
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

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

    if (
      body.reservation_status !== undefined &&
      !isReservationStatus(body.reservation_status)
    ) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Nepoznat status rezervacije." },
        { status: 400 }
      );
    }

    // Materials are checked before the activity is written, so a bad entry
    // refuses the whole proposal instead of leaving a half-attached one.
    const materials: ActivityMaterialInput[] = [];
    if (body.materials !== undefined) {
      if (!Array.isArray(body.materials)) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: "Materijali nisu ispravno zadani." },
          { status: 400 }
        );
      }
      if (body.materials.length > MAX_ACTIVITY_MATERIALS) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            error: `Najviše ${MAX_ACTIVITY_MATERIALS} materijala po aktivnosti.`,
          },
          { status: 400 }
        );
      }
      for (let i = 0; i < body.materials.length; i++) {
        const parsed = parseActivityMaterial(body.materials[i], i);
        if (!parsed.ok) {
          return NextResponse.json<ApiResponse>(
            { success: false, error: parsed.error },
            { status: 400 }
          );
        }
        if (parsed.material.kind === "file") {
          return NextResponse.json<ApiResponse>(
            {
              success: false,
              error: "Datoteke se prilažu nakon što je aktivnost stvorena.",
            },
            { status: 400 }
          );
        }
        materials.push(parsed.material);
      }
    }

    const row = {
      ...pickActivityFields(body),
      prerequisites: body.prerequisites || "",
      target_audience: body.target_audience || "",
      // Server-owned: a proposal always starts unreviewed.
      created_by: user.id,
      status: "pending",
    };

    // The activity and its reading list in one transaction: a bad material
    // rolls the proposal back with it, instead of leaving it standing without
    // the list its author wrote.
    let activity: Activity;
    try {
      activity = await withUser(user.id, async (tx) => {
        const [created] = await tx<Activity[]>`
          INSERT INTO activities ${tx(row)} RETURNING *
        `;
        if (materials.length > 0) {
          await tx`
            INSERT INTO activity_materials ${tx(
              materials.map((m) => ({
                activity_id: created.id,
                phase: m.phase,
                kind: m.kind,
                title: m.title,
                url: m.url ?? "",
                note: m.note ?? "",
                position: m.position ?? 0,
              }))
            )}
          `;
        }
        return created;
      });
    } catch (err) {
      const message = userFacingDbError(err);
      if (!message) throw err;
      return NextResponse.json<ApiResponse>(
        { success: false, error: message },
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
