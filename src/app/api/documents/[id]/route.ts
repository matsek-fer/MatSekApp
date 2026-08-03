import { createClient as createServerClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";
import { MAX_DOCUMENT_TITLE_LENGTH } from "@/lib/validation";
import type {
  ApiResponse,
  Document,
  DocumentBlock,
  DocumentWithBlocks,
} from "@/types";

/**
 * One document.
 *
 * Ownership is never tested here by hand. Every query goes through the RLS
 * client, and the policies on `documents` and `document_blocks` are
 * owner-only, so another member's id simply returns nothing — which is why
 * the miss and the forbidden case both surface as 404.
 */

/** How long the reader's copy of the file stays fetchable. */
const FILE_URL_TTL_SECONDS = 60 * 60;

/** GET /api/documents/[id] — the document, its blocks, and a signed file URL. */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;

    const { data: document, error } = await supabase
      .from("documents")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !document) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Dokument nije pronađen." },
        { status: 404 }
      );
    }

    const { data: blocks, error: blocksError } = await supabase
      .from("document_blocks")
      .select("*")
      .eq("document_id", id)
      .order("block_index", { ascending: true });

    if (blocksError) {
      console.error("GET /api/documents/[id] blocks error:", blocksError);
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Dokument nije moguće dohvatiti." },
        { status: 500 }
      );
    }

    // The PDF reader draws the original file, so it needs the bytes; a
    // document still uploading or already failed has nothing worth signing.
    let fileUrl: string | null = null;
    if (document.status === "ready") {
      const { data: signed } = await supabase.storage
        .from("documents")
        .createSignedUrl(document.storage_path, FILE_URL_TTL_SECONDS);
      fileUrl = signed?.signedUrl ?? null;
    }

    return NextResponse.json<ApiResponse<DocumentWithBlocks>>(
      {
        success: true,
        data: {
          document,
          blocks: (blocks ?? []) as DocumentBlock[],
          file_url: fileUrl,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /api/documents/[id] error:", err);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/documents/[id] — rename.
 *
 * The title is the only thing a member owns here. Everything else on the row
 * describes the file or the extraction and is written by the server.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const body = (await request.json()) as Record<string, unknown>;
    const { title } = body;

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

    const { data: document, error } = await supabase
      .from("documents")
      .update({ title: trimmedTitle })
      .eq("id", params.id)
      .select()
      .single();

    if (error || !document) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Dokument nije pronađen." },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<Document>>(
      { success: true, data: document },
      { status: 200 }
    );
  } catch (err) {
    console.error("PATCH /api/documents/[id] error:", err);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/documents/[id] — remove the row and the file.
 *
 * The object goes first. If the row went first, RLS would no longer see the
 * document and the file would be orphaned in the bucket with nothing left
 * pointing at it; the other order leaves at worst a row whose file is gone,
 * which the reader already handles.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { data: document, error } = await supabase
      .from("documents")
      .select("*")
      .eq("id", params.id)
      .single();

    if (error || !document) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Dokument nije pronađen." },
        { status: 404 }
      );
    }

    const { error: storageError } = await supabase.storage
      .from("documents")
      .remove([document.storage_path]);

    if (storageError) {
      console.error("DELETE /api/documents/[id] storage error:", storageError);
    }

    // Blocks go with it — `document_blocks.document_id` cascades.
    const { error: deleteError } = await supabase
      .from("documents")
      .delete()
      .eq("id", params.id);

    if (deleteError) {
      console.error("DELETE /api/documents/[id] error:", deleteError);
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Dokument nije moguće obrisati." },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<{ message: string }>>(
      { success: true, data: { message: "Dokument je obrisan." } },
      { status: 200 }
    );
  } catch (err) {
    console.error("DELETE /api/documents/[id] error:", err);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
