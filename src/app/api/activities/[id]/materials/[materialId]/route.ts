import { NextResponse, type NextRequest } from "next/server";
import { withUser } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { deleteFile } from "@/lib/storage";
import { isUuid } from "@/lib/validation";
import { materialNotice, notifyAdminsOfEdit } from "@/lib/activity-edits";
import type { ApiResponse } from "@/types";

/**
 * DELETE /api/activities/[id]/materials/[materialId]
 *
 * Removes one material and, for a file, its object. The edit form calls it
 * for a material its author took off the list, and both forms when an upload
 * fails after the row was reserved, so the activity page never lists a file
 * that was never stored.
 *
 * RLS decides who may delete (the author while the activity is pending or
 * approved, admins always); a refusal simply finds no row and reads as 404.
 * As with adding one, removing a material from an approved activity leaves
 * it published and notifies the admins.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; materialId: string }> }
) {
  try {
    const { id: activityId, materialId } = await params;
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Nisi prijavljen/a." },
        { status: 401 }
      );
    }

    const [material] =
      isUuid(activityId) && isUuid(materialId)
        ? await withUser(user.id, (tx) =>
            tx<{ id: string; kind: string; title: string; storage_path: string }[]>`
              SELECT id, kind, title, storage_path FROM activity_materials
              WHERE id = ${materialId} AND activity_id = ${activityId}
            `
          )
        : [];

    if (!material) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Materijal nije pronađen." },
        { status: 404 }
      );
    }

    // The row goes first here, unlike under Supabase: the bucket has no
    // policies of its own any more, so the RLS-checked DELETE is what proves
    // the caller may remove the file — a refused delete leaves both alone.
    const { count, activity } = await withUser(user.id, async (tx) => {
      const deleted = await tx`
        DELETE FROM activity_materials WHERE id = ${materialId}
      `;
      // Read after the delete went through, so a refusal announces nothing.
      const [row] = await tx<{ title: string; created_by: string; status: string }[]>`
        SELECT title, created_by, status FROM activities WHERE id = ${activityId}
      `;
      return { count: deleted.count, activity: row };
    });

    if (!count) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Materijal nije moguće obrisati." },
        { status: 403 }
      );
    }

    if (material.kind === "file" && material.storage_path) {
      try {
        await deleteFile(material.storage_path);
      } catch (storageError) {
        // Logged, not reported: the material is gone from the page either
        // way, and an orphaned object is only storage.
        console.error(
          "DELETE /api/activities/[id]/materials storage error:",
          storageError
        );
      }
    }

    if (
      activity?.status === "approved" &&
      activity.created_by === user.id &&
      user.role !== "admin"
    ) {
      await notifyAdminsOfEdit(
        activityId,
        materialNotice(
          user.full_name,
          activity.title,
          material.title,
          "removed"
        )
      );
    }

    return NextResponse.json<ApiResponse<{ message: string }>>(
      { success: true, data: { message: "Materijal je obrisan." } },
      { status: 200 }
    );
  } catch (err) {
    console.error("DELETE /api/activities/[id]/materials/[materialId] error:", err);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
