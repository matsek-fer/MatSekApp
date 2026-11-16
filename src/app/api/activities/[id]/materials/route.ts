import { NextResponse, type NextRequest } from "next/server";
import { randomUUID } from "node:crypto";
import { withUser } from "@/lib/db";
import { userFacingDbError } from "@/lib/db/errors";
import { getCurrentUser } from "@/lib/auth/session";
import {
  isUuid,
  MAX_ACTIVITY_MATERIALS,
  parseActivityMaterial,
  safeFileName,
} from "@/lib/validation";
import { materialFileUrl } from "@/lib/activity-materials";
import { materialNotice, notifyAdminsOfEdit } from "@/lib/activity-edits";
import type {
  ActivityMaterial,
  ApiResponse,
  CreateActivityMaterialResult,
} from "@/types";

/**
 * POST /api/activities/[id]/materials — attach one material to an activity.
 *
 * On a new proposal, link and library materials ride along with the activity
 * itself and this route is for files, which need the activity's id in their
 * storage path. The edit form uses it for every kind. For a file it reserves
 * the row and answers with the material's file route, which the browser
 * PUTs the bytes to as a second request; that route enforces the size and
 * type limits and writes to the bucket.
 *
 * Who may attach is decided by RLS on `activity_materials` (the author while
 * the activity is pending or approved, admins always); the checks here only
 * turn a policy refusal into a readable message. A material added to an approved activity does not send it back
 * for review — the admins are notified instead.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: activityId } = await params;
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Nisi prijavljen/a." },
        { status: 401 }
      );
    }

    const [activity] = isUuid(activityId)
      ? await withUser(user.id, (tx) =>
          tx<{ id: string; title: string; created_by: string; status: string }[]>`
            SELECT id, title, created_by, status FROM activities WHERE id = ${activityId}
          `
        )
      : [];

    if (!activity) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Aktivnost nije pronađena." },
        { status: 404 }
      );
    }

    const isAdmin = user.role === "admin";
    const isOwner = activity.created_by === user.id;

    if (!isAdmin && !(isOwner && activity.status !== "rejected")) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error:
            "Materijale možeš dodavati samo svojim aktivnostima koje nisu odbijene.",
        },
        { status: 403 }
      );
    }

    const [{ count }] = await withUser(user.id, (tx) =>
      tx<{ count: number }[]>`
        SELECT count(*)::int AS count FROM activity_materials
        WHERE activity_id = ${activityId}
      `
    );

    if (count >= MAX_ACTIVITY_MATERIALS) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: `Najviše ${MAX_ACTIVITY_MATERIALS} materijala po aktivnosti.`,
        },
        { status: 409 }
      );
    }

    const body = await request.json();
    const parsed = parseActivityMaterial(body, count);
    if (!parsed.ok) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: parsed.error },
        { status: 400 }
      );
    }
    const m = parsed.material;

    // The id is generated here so the storage path is known before the row
    // is written — one insert, no follow-up update.
    const id = randomUUID();
    const fileName = m.kind === "file" ? safeFileName(m.file_name ?? "") : "";
    const storagePath =
      m.kind === "file" ? `${activityId}/${id}/${fileName}` : "";

    let material: ActivityMaterial;
    try {
      [material] = await withUser(user.id, (tx) =>
        tx<ActivityMaterial[]>`
          INSERT INTO activity_materials ${tx({
            id,
            activity_id: activityId,
            phase: m.phase,
            kind: m.kind,
            title: m.title,
            url: m.url ?? "",
            note: m.note ?? "",
            position: m.position ?? 0,
            storage_path: storagePath,
            file_name: m.kind === "file" ? m.file_name ?? "" : "",
            content_type: m.kind === "file" ? m.content_type ?? "" : "",
            byte_size: m.kind === "file" ? m.byte_size ?? 0 : 0,
          })}
          RETURNING *
        `
      );
    } catch (insertError) {
      console.error("POST /api/activities/[id]/materials insert error:", insertError);
      const reason = userFacingDbError(insertError);
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: `Materijal nije moguće spremiti${reason ? ` (${reason})` : ""}.`,
        },
        { status: 400 }
      );
    }

    // A pending activity's materials are read at review, and an admin's own
    // additions need no announcing.
    const announce = async () => {
      if (isAdmin || activity.status !== "approved") return;
      await notifyAdminsOfEdit(
        activityId,
        materialNotice(user.full_name, activity.title, m.title, "added")
      );
    };

    await announce();
    return NextResponse.json<ApiResponse<CreateActivityMaterialResult>>(
      {
        success: true,
        data: {
          material,
          upload_url: m.kind === "file" ? materialFileUrl(material) : null,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/activities/[id]/materials error:", err);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
