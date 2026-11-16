import { createClient as createServerClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";
import { ACTIVITY_MATERIALS_BUCKET } from "@/lib/activity-materials";
import type { ApiResponse } from "@/types";

/**
 * DELETE /api/activities/[id]/materials/[materialId]
 *
 * Removes one material and, for a file, its object. The form calls this
 * when an upload fails after the row was reserved, so the activity page
 * never lists a file that was never stored. The object goes first, for the
 * reason given on the documents route: once the row is gone RLS no longer
 * sees the activity's file and it would be orphaned in the bucket.
 *
 * RLS decides who may delete (author while pending, admins); a refusal
 * simply finds no row and reads as 404.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; materialId: string }> }
) {
  try {
    const supabase = await createServerClient();
    const { id: activityId, materialId } = await params;
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Nisi prijavljen/a." },
        { status: 401 }
      );
    }

    const { data: material } = await supabase
      .from("activity_materials")
      .select("id, kind, storage_path")
      .eq("id", materialId)
      .eq("activity_id", activityId)
      .single();

    if (!material) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Materijal nije pronađen." },
        { status: 404 }
      );
    }

    if (material.kind === "file" && material.storage_path) {
      const { error: storageError } = await supabase.storage
        .from(ACTIVITY_MATERIALS_BUCKET)
        .remove([material.storage_path]);
      if (storageError) {
        console.error(
          "DELETE /api/activities/[id]/materials storage error:",
          storageError
        );
      }
    }

    const { error, count } = await supabase
      .from("activity_materials")
      .delete({ count: "exact" })
      .eq("id", materialId);

    if (error || !count) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Materijal nije moguće obrisati." },
        { status: error ? 500 : 403 }
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
