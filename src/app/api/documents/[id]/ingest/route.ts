import { createClient as createServerClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";
import { extractDocument } from "@/lib/documents/extract";
import { MAX_DOCUMENT_BYTES } from "@/lib/validation";
import type { ApiResponse, Document } from "@/types";

/**
 * Extraction — step three of the upload handshake.
 *
 * The bytes are already in Storage by the time this is called; this route
 * fetches them back, turns them into blocks, and moves the document to
 * `ready`. It runs inline rather than on a queue, which the project has no
 * precedent for, so the caps in lib/validation.ts are what keep it bounded.
 *
 * It is also the retry point: a document in `failed` can be ingested again
 * without re-uploading anything.
 */

// pdfjs-dist needs real Node, not the edge runtime, and extraction time
// scales with the document, so this must not be statically evaluated.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** Blocks are inserted in batches; a 500-page PDF is thousands of rows. */
const INSERT_CHUNK = 500;

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createServerClient();
  const { id } = params;

  try {
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
      .eq("id", id)
      .single();

    if (error || !document) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Dokument nije pronađen." },
        { status: 404 }
      );
    }

    // 'extracting' means another request is already inside this route;
    // re-ingesting would race a second set of blocks against the first.
    if (document.status === "extracting") {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Dokument se već obrađuje." },
        { status: 409 }
      );
    }

    // 'ready' normally means nothing to do — except when the extraction
    // algorithm has improved since this document went through it. ?force=1
    // re-extracts in place. Block ids change, so saved citations go stale;
    // that is what their quoteHash exists to notice.
    const force = request.nextUrl.searchParams.get("force") === "1";
    if (document.status === "ready" && !force) {
      return NextResponse.json<ApiResponse<Document>>(
        { success: true, data: document },
        { status: 200 }
      );
    }

    await supabase
      .from("documents")
      .update({ status: "extracting", error_message: "" })
      .eq("id", id);

    const { data: file, error: downloadError } = await supabase.storage
      .from("documents")
      .download(document.storage_path);

    if (downloadError || !file) {
      return await markFailed(
        supabase,
        id,
        "Datoteka nije pronađena. Pokušaj je učitati ponovno."
      );
    }

    const bytes = new Uint8Array(await file.arrayBuffer());

    // Read BEFORE extraction: pdf.js transfers the buffer to its worker, and
    // after that `bytes.byteLength` is a detached buffer's 0.
    const byteSize = bytes.byteLength;

    // The bucket enforces this on the way in; the check here catches a bucket
    // whose limit was widened without the app being told.
    if (byteSize > MAX_DOCUMENT_BYTES) {
      return await markFailed(supabase, id, "Datoteka je prevelika.");
    }

    let extracted;
    try {
      extracted = await extractDocument(bytes, document.kind);
    } catch (err) {
      console.error("POST /api/documents/[id]/ingest extract error:", err);
      return await markFailed(
        supabase,
        id,
        "Tekst iz datoteke nije moguće pročitati. Je li datoteka ispravna?"
      );
    }

    if (extracted.blocks.length === 0) {
      return await markFailed(
        supabase,
        id,
        "U datoteci nema teksta koji se može pročitati. Skenirani PDF-ovi bez tekstualnog sloja nisu podržani."
      );
    }

    // A retry has old blocks to clear. The unique index on
    // (document_id, block_index) would reject them anyway; this makes the
    // reason explicit rather than surfacing as a 23505.
    await supabase.from("document_blocks").delete().eq("document_id", id);

    const rows = extracted.blocks.map((block, index) => ({
      document_id: id,
      page: block.page,
      block_index: index,
      text: block.text,
    }));

    for (let i = 0; i < rows.length; i += INSERT_CHUNK) {
      const { error: insertError } = await supabase
        .from("document_blocks")
        .insert(rows.slice(i, i + INSERT_CHUNK));

      if (insertError) {
        console.error("POST /api/documents/[id]/ingest insert error:", insertError);
        return await markFailed(
          supabase,
          id,
          "Tekst nije moguće spremiti. Pokušaj ponovno."
        );
      }
    }

    const { data: updated, error: updateError } = await supabase
      .from("documents")
      .update({
        status: "ready",
        page_count: extracted.pageCount,
        block_count: rows.length,
        byte_size: byteSize,
        error_message: extracted.truncated
          ? "Dokument je predug pa je pročitan samo njegov početak."
          : "",
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError || !updated) {
      console.error("POST /api/documents/[id]/ingest update error:", updateError);
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Dokument nije moguće dovršiti." },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<Document>>(
      { success: true, data: updated },
      { status: 200 }
    );
  } catch (err) {
    console.error("POST /api/documents/[id]/ingest error:", err);
    // A document left in 'extracting' by a crash would never be retryable,
    // since the guard above refuses to touch one.
    await supabase
      .from("documents")
      .update({ status: "failed", error_message: "Obrada nije uspjela." })
      .eq("id", id);

    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Records why extraction failed, in Croatian, on the row itself — the library
 * page shows it, and the member can retry from there without re-uploading.
 */
async function markFailed(
  supabase: ReturnType<typeof createServerClient>,
  id: string,
  message: string
) {
  await supabase
    .from("documents")
    .update({ status: "failed", error_message: message })
    .eq("id", id);

  return NextResponse.json<ApiResponse>(
    { success: false, error: message },
    { status: 422 }
  );
}
