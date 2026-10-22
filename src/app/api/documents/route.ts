import { createClient as createServerClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";
import { randomUUID } from "node:crypto";
import {
  checkThrottle,
  MAX_DOCUMENTS_PER_USER,
  THROTTLES,
} from "@/lib/ai/throttle";
import {
  isDocumentKind,
  MAX_DOCUMENT_TITLE_LENGTH,
} from "@/lib/validation";
import {
  DOCUMENT_KIND_EXTENSIONS,
  DOCUMENT_KIND_MIME,
  type ApiResponse,
  type CreateDocumentResult,
  type Document,
} from "@/types";

/**
 * A member's uploaded documents.
 *
 * Upload is a three-step handshake and this route is the first step. The
 * browser sends the bytes STRAIGHT TO STORAGE on a signed URL — they never
 * pass through Next — so this route creates the row and hands back a URL to
 * PUT to, and `/api/documents/[id]/ingest` picks it up afterwards.
 *
 * The alternative, `request.formData()` here, would cap at Next's body limit,
 * hold the whole file in memory, and need its own size and MIME checks. The
 * bucket already enforces both, and it is the only thing positioned to.
 */

/** GET /api/documents — the member's own library, newest first. */
export async function GET() {
  try {
    const supabase = createServerClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Nisi prijavljen/a." },
        { status: 401 }
      );
    }

    const { data: documents, error } = await supabase
      .from("documents")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("GET /api/documents error:", error);
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Dokumente nije moguće dohvatiti." },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<Document[]>>(
      { success: true, data: documents ?? [] },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /api/documents error:", err);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/documents — reserve a document and mint a signed upload URL.
 *
 * The row lands in `uploading`. Until the member's browser completes the PUT
 * and calls the ingest route, that is all it is: a reservation.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Nisi prijavljen/a." },
        { status: 401 }
      );
    }

    const refused = await checkThrottle(supabase, THROTTLES.upload);
    if (refused) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: refused },
        { status: 429 }
      );
    }

    // A cap on the library, not the hour: Storage is finite and 50 documents
    // is a heavy semester. RLS scopes the count to the member.
    const { count } = await supabase
      .from("documents")
      .select("id", { count: "exact", head: true });

    if ((count ?? 0) >= MAX_DOCUMENTS_PER_USER) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: `Dosegnut je najveći broj dokumenata (${MAX_DOCUMENTS_PER_USER}). Obriši neki stari.`,
        },
        { status: 409 }
      );
    }

    const body = (await request.json()) as Record<string, unknown>;
    const { title, kind } = body;

    if (!isDocumentKind(kind)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Nepodržana vrsta dokumenta." },
        { status: 400 }
      );
    }

    if (typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Naslov je obavezan." },
        { status: 400 }
      );
    }

    const trimmedTitle = title.trim();
    if (trimmedTitle.length > MAX_DOCUMENT_TITLE_LENGTH) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Naslov je predug." },
        { status: 400 }
      );
    }

    // The id is generated here rather than left to the database default so
    // the storage path is known before the row is written — one insert
    // instead of an insert followed by an update to fill the path in.
    const id = randomUUID();
    const storagePath = `${session.user.id}/${id}/original.${DOCUMENT_KIND_EXTENSIONS[kind]}`;

    const { data: document, error: insertError } = await supabase
      .from("documents")
      .insert({
        id,
        owner_id: session.user.id,
        title: trimmedTitle,
        kind,
        status: "uploading",
        storage_path: storagePath,
      })
      .select()
      .single();

    if (insertError || !document) {
      console.error("POST /api/documents insert error:", insertError);
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Dokument nije moguće stvoriti." },
        { status: 500 }
      );
    }

    const { data: signed, error: signError } = await supabase.storage
      .from("documents")
      .createSignedUploadUrl(storagePath);

    if (signError || !signed) {
      // The reservation is useless without somewhere to put the bytes, so it
      // is cleaned up rather than left as a permanent 'uploading' row.
      await supabase.from("documents").delete().eq("id", id);
      console.error("POST /api/documents sign error:", signError);
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Učitavanje nije moguće pokrenuti." },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<CreateDocumentResult>>(
      {
        success: true,
        data: {
          document,
          upload_url: signed.signedUrl,
          upload_token: signed.token,
          content_type: DOCUMENT_KIND_MIME[kind],
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/documents error:", err);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
