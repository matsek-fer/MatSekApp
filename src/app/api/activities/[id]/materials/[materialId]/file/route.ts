import { NextResponse, type NextRequest } from "next/server";
import { withUser } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
import { getFileStream, putFile } from "@/lib/storage";
import { isUuid, MAX_ACTIVITY_MATERIAL_BYTES } from "@/lib/validation";
import type { ActivityMaterial, ApiResponse } from "@/types";

/**
 * A file material's bytes — the only door to the bucket.
 *
 * Both directions look the material up through withUser() first, so the
 * `activity_materials` policies decide, exactly as the bucket's policies on
 * the activity's path prefix did under Supabase: anyone who may see the
 * activity may download, and only its author (while it is pending or
 * approved) or an admin may upload. The bucket itself is never exposed.
 */

type Params = { params: Promise<{ id: string; materialId: string }> };

function fail(status: number, error: string) {
  return NextResponse.json<ApiResponse>({ success: false, error }, { status });
}

/**
 * PUT — step two of attaching a file, after POST …/materials reserved the
 * row. The limits Supabase's bucket used to enforce are enforced here: the
 * declared type must be the one the row was reserved with, the body is
 * counted as it arrives and cut off past 25 MiB, and it must come to the
 * size that was declared, so the row describes the file it points at.
 */
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id: activityId, materialId } = await params;
    const user = await getCurrentUser();
    if (!user) return fail(401, "Nisi prijavljen/a.");
    if (!isUuid(activityId) || !isUuid(materialId)) {
      return fail(404, "Materijal nije pronađen.");
    }

    const [row] = await withUser(user.id, (tx) =>
      tx<(ActivityMaterial & { created_by: string; activity_status: string })[]>`
        SELECT m.*, a.created_by, a.status AS activity_status
        FROM activity_materials m
        JOIN activities a ON a.id = m.activity_id
        WHERE m.id = ${materialId} AND m.activity_id = ${activityId}
      `
    );
    if (!row || row.kind !== "file" || !row.storage_path) {
      return fail(404, "Materijal nije pronađen.");
    }

    // The same test as the "Authors add materials" policy, which a read
    // cannot apply for us.
    const mayWrite =
      user.role === "admin" ||
      (row.created_by === user.id &&
        (row.activity_status === "pending" || row.activity_status === "approved"));
    if (!mayWrite) return fail(403, "Nemaš dozvolu za učitavanje ove datoteke.");

    const declaredType = request.headers.get("content-type")?.split(";")[0].trim();
    if (declaredType !== row.content_type) {
      return fail(415, "Vrsta datoteke ne odgovara materijalu.");
    }

    const declaredLength = Number(request.headers.get("content-length"));
    if (declaredLength > MAX_ACTIVITY_MATERIAL_BYTES) {
      return fail(413, "Datoteka je veća od 25 MB.");
    }
    if (!request.body) return fail(400, "Datoteka je prazna.");

    const chunks: Uint8Array[] = [];
    let received = 0;
    const reader = request.body.getReader();
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      received += value.byteLength;
      if (received > MAX_ACTIVITY_MATERIAL_BYTES) {
        await reader.cancel();
        return fail(413, "Datoteka je veća od 25 MB.");
      }
      chunks.push(value);
    }
    if (received === 0) return fail(400, "Datoteka je prazna.");
    if (received !== row.byte_size) {
      return fail(400, "Datoteka nije one veličine koja je najavljena.");
    }

    const bytes = new Uint8Array(received);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }

    await putFile(row.storage_path, bytes, row.content_type);

    return NextResponse.json<ApiResponse<{ message: string }>>(
      { success: true, data: { message: "Datoteka je učitana." } },
      { status: 200 }
    );
  } catch (err) {
    console.error("PUT /api/activities/[id]/materials/[materialId]/file error:", err);
    return fail(500, "Učitavanje nije uspjelo.");
  }
}

/**
 * GET — the download, for anyone who may see the activity, visitors
 * included once it is approved. Sent as an attachment under the name it
 * was uploaded with, and never sniffed into something the browser renders.
 */
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id: activityId, materialId } = await params;
    if (!isUuid(activityId) || !isUuid(materialId)) {
      return fail(404, "Materijal nije pronađen.");
    }

    const user = await getCurrentUser();
    const [material] = await withUser(user?.id ?? null, (tx) =>
      tx<ActivityMaterial[]>`
        SELECT * FROM activity_materials
        WHERE id = ${materialId} AND activity_id = ${activityId}
      `
    );
    if (!material || material.kind !== "file" || !material.storage_path) {
      return fail(404, "Materijal nije pronađen.");
    }

    let file;
    try {
      file = await getFileStream(material.storage_path);
    } catch (err) {
      // Reserved but never uploaded, or removed from the bucket by hand.
      if ((err as { name?: string }).name === "NoSuchKey") {
        return fail(404, "Datoteka nije pronađena.");
      }
      throw err;
    }

    const name = material.file_name || "datoteka";
    const asciiName = name.replace(/[^\x20-\x7e]|["\\]/g, "_");
    const headers = new Headers({
      "Content-Type": material.content_type || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${asciiName}"; filename*=UTF-8''${encodeURIComponent(name)}`,
      "Cache-Control": "private, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    });
    if (file.length !== undefined) headers.set("Content-Length", String(file.length));

    return new Response(file.body, { status: 200, headers });
  } catch (err) {
    console.error("GET /api/activities/[id]/materials/[materialId]/file error:", err);
    return fail(500, "Datoteku nije moguće dohvatiti.");
  }
}
