import { createClient as createServerClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";
import { randomUUID } from "node:crypto";
import {
  MAX_ACTIVITY_MATERIALS,
  parseActivityMaterial,
  safeFileName,
} from "@/lib/validation";
import { ACTIVITY_MATERIALS_BUCKET } from "@/lib/activity-materials";
import type {
  ActivityMaterial,
  ApiResponse,
  CreateActivityMaterialResult,
} from "@/types";

/**
 * POST /api/activities/[id]/materials — attach one material to a proposal.
 *
 * Link and library materials normally ride along with the activity itself;
 * this route exists for files, which need the activity's id in their storage
 * path. For a file it reserves the row and mints a signed upload URL, and
 * the browser PUTs the bytes straight to Storage — the same three-step
 * handshake as documents, for the same reasons (see /api/documents).
 *
 * Who may attach is decided by RLS on `activity_materials` and on the
 * bucket (the author while pending, admins always); the checks here only
 * turn a policy refusal into a readable message.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createServerClient();
    const { id: activityId } = await params;
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Nisi prijavljen/a." },
        { status: 401 }
      );
    }

    const { data: activity } = await supabase
      .from("activities")
      .select("id, created_by, status")
      .eq("id", activityId)
      .single();

    if (!activity) {
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
    const isOwner = activity.created_by === user.id;

    if (!isAdmin && !(isOwner && activity.status === "pending")) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Materijale možeš dodavati samo svojim aktivnostima na čekanju.",
        },
        { status: 403 }
      );
    }

    const { count } = await supabase
      .from("activity_materials")
      .select("id", { count: "exact", head: true })
      .eq("activity_id", activityId);

    if ((count ?? 0) >= MAX_ACTIVITY_MATERIALS) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: `Najviše ${MAX_ACTIVITY_MATERIALS} materijala po aktivnosti.`,
        },
        { status: 409 }
      );
    }

    const body = await request.json();
    const parsed = parseActivityMaterial(body, count ?? 0);
    if (!parsed.ok) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: parsed.error },
        { status: 400 }
      );
    }
    const m = parsed.material;

    // The id is generated here so the storage path is known before the row
    // is written — one insert, no follow-up update (as in /api/documents).
    const id = randomUUID();
    const fileName = m.kind === "file" ? safeFileName(m.file_name ?? "") : "";
    const storagePath =
      m.kind === "file" ? `${activityId}/${id}/${fileName}` : "";

    const { data: material, error: insertError } = await supabase
      .from("activity_materials")
      .insert({
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
      })
      .select()
      .single();

    if (insertError || !material) {
      console.error("POST /api/activities/[id]/materials insert error:", insertError);
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Materijal nije moguće spremiti." },
        { status: 400 }
      );
    }

    if (m.kind !== "file") {
      return NextResponse.json<ApiResponse<CreateActivityMaterialResult>>(
        {
          success: true,
          data: { material, upload_url: null, upload_token: null },
        },
        { status: 201 }
      );
    }

    const { data: signed, error: signError } = await supabase.storage
      .from(ACTIVITY_MATERIALS_BUCKET)
      .createSignedUploadUrl(storagePath);

    if (signError || !signed) {
      // A file row with nowhere to put the bytes is a broken link on the
      // activity page, so it is withdrawn rather than left behind.
      await supabase.from("activity_materials").delete().eq("id", id);
      console.error("POST /api/activities/[id]/materials sign error:", signError);
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Učitavanje nije moguće pokrenuti." },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<CreateActivityMaterialResult>>(
      {
        success: true,
        data: {
          material: material as ActivityMaterial,
          upload_url: signed.signedUrl,
          upload_token: signed.token,
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
