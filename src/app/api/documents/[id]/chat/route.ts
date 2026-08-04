import { createClient as createServerClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";
import { getAdapter } from "@/lib/ai";
import { AiError, redactError } from "@/lib/ai/errors";
import { loadUserKey } from "@/lib/ai/keys";
import {
  assembleFollowUpTurn,
  assembleUserTurn,
  systemPrompt,
} from "@/lib/ai/prompt";
import {
  hashQuote,
  isDocumentAnchor,
  neighbouringBlocks,
  resolveExcerpt,
  type DocumentAnchor,
} from "@/lib/documents/anchors";
import { MAX_EXCERPT_LENGTH, MAX_QUESTION_LENGTH } from "@/lib/validation";
import type { AiEvent, ChatTurn } from "@/lib/ai/types";
import type { ApiResponse, ChatMessage, DocumentBlock } from "@/types";

/**
 * The streaming route — the first in this repo.
 *
 * Everything that can fail fails BEFORE the stream opens, as ordinary JSON
 * with a status code. Once the 200 and the SSE headers are out, the status
 * is fixed forever, so from that point every failure — provider rate limit,
 * refusal, dropped key — travels as a typed `error` frame inside the stream.
 * That is why this is SSE with framed JSON and not a naked text stream.
 *
 * Frames: `data: {"type":"token","text":...}`, `{"type":"done","message":...}`,
 * `{"type":"error","error":...}` — one JSON object per `data:` line.
 *
 * The member's question is persisted before the stream opens; the assistant
 * row is persisted in a finally, so a disconnect mid-answer still records
 * what was produced, marked stopped_early. On refusal the accumulated text
 * is DISCARDED — an answer the provider disowned is not an answer — and the
 * refusal is recorded as an error_note on an empty assistant row.
 */

// Streaming needs real Node and must never be statically evaluated. The
// window is generous because the answer is as long as the model makes it.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

/** Ample for an answer; the provider stops sooner on its own. */
const MAX_ANSWER_TOKENS = 8_192;

/** How much transcript is replayed to the model. Bounds cost per message. */
const MAX_HISTORY_TURNS = 12;

const encoder = new TextEncoder();

function frame(payload: Record<string, unknown>): Uint8Array {
  return encoder.encode(`data: ${JSON.stringify(payload)}\n\n`);
}

export async function POST(
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
    const { threadId, question, anchor } = body as {
      threadId?: unknown;
      question?: unknown;
      anchor?: unknown;
    };

    if (typeof threadId !== "string") {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Razgovor nije naveden." },
        { status: 400 }
      );
    }

    if (typeof question !== "string" || question.trim().length === 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Pitanje je obavezno." },
        { status: 400 }
      );
    }

    const trimmedQuestion = question.trim();
    if (trimmedQuestion.length > MAX_QUESTION_LENGTH) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Pitanje je predugo." },
        { status: 400 }
      );
    }

    if (anchor !== undefined && anchor !== null && !isDocumentAnchor(anchor)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Odabir nije valjan." },
        { status: 400 }
      );
    }

    // Thread and document through RLS — a guessed id is a 404, and the
    // thread carries the provider and model this conversation is locked to.
    const { data: thread } = await supabase
      .from("chat_threads")
      .select("*")
      .eq("id", threadId)
      .eq("document_id", params.id)
      .single();

    if (!thread) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Razgovor nije pronađen." },
        { status: 404 }
      );
    }

    const { data: document } = await supabase
      .from("documents")
      .select("*")
      .eq("id", params.id)
      .single();

    if (!document) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Dokument nije pronađen." },
        { status: 404 }
      );
    }

    // The key can be missing or expired mid-conversation — the cookie has a
    // 12-hour ceiling — so it is checked while a JSON 401 is still possible.
    const apiKey = loadUserKey(session.user.id, thread.provider);
    if (!apiKey) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Nemaš spremljen ključ za ovog pružatelja. Upiši ga u postavkama profila.",
        },
        { status: 401 }
      );
    }

    // THE INVARIANT: the excerpt is resolved here, from the server's own
    // blocks. The browser's copy of the selected text never enters a prompt.
    let excerpt: string | null = null;
    let context: { before: string[]; after: string[] } = { before: [], after: [] };
    let storedAnchor: DocumentAnchor | null = null;
    let anchorPage = 0;

    if (anchor) {
      const { data: blocks } = await supabase
        .from("document_blocks")
        .select("*")
        .eq("document_id", params.id)
        .order("block_index", { ascending: true });

      const blockRows = (blocks ?? []) as DocumentBlock[];
      excerpt = resolveExcerpt(blockRows, anchor);

      if (excerpt === null) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: "Odabir se ne poklapa s dokumentom. Odaberi tekst ponovno." },
          { status: 422 }
        );
      }

      if (excerpt.length > MAX_EXCERPT_LENGTH) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: "Odabrani ulomak je predug. Odaberi kraći dio." },
          { status: 422 }
        );
      }

      context = neighbouringBlocks(blockRows, anchor);
      storedAnchor = {
        ...anchor,
        quote: excerpt,
        quoteHash: hashQuote(excerpt),
      };
      if (document.kind === "pdf") {
        anchorPage =
          blockRows.find((b) => b.id === anchor.fromBlockId)?.page ?? 0;
      }
    }

    // Earlier turns, replayed. Rows that carry no text (refusals, failures)
    // are skipped rather than sent as empty turns.
    const { data: history } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("thread_id", threadId)
      .order("created_at", { ascending: true });

    const turns: ChatTurn[] = ((history ?? []) as ChatMessage[])
      .filter((m) => m.body.length > 0)
      .slice(-MAX_HISTORY_TURNS)
      .map((m) => ({ role: m.role, content: m.body }));

    let userTurn;
    if (excerpt !== null && storedAnchor) {
      // One block either side rides along: a selected formula alone is often
      // meaningless without the sentence introducing it, and this is the
      // in-scope half of the mangled-equations mitigation.
      const contextedExcerpt = [
        ...context.before,
        excerpt,
        ...context.after,
      ].join("\n");

      userTurn = assembleUserTurn(trimmedQuestion, contextedExcerpt, {
        documentTitle: document.title,
        page: anchorPage,
      });
    } else {
      userTurn = assembleFollowUpTurn(trimmedQuestion);
    }

    turns.push({ role: "user", content: userTurn.content });

    // The member's turn is written before the stream opens: if the provider
    // dies mid-answer the question still exists, and a retry can see it.
    const { error: insertError } = await supabase.from("chat_messages").insert({
      thread_id: threadId,
      role: "user",
      body: trimmedQuestion,
      anchor: storedAnchor,
    });

    if (insertError) {
      console.error("POST /api/documents/[id]/chat insert error:", insertError);
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Poruku nije moguće spremiti." },
        { status: 500 }
      );
    }

    const adapter = getAdapter(thread.provider);

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        let accumulated = "";
        let stoppedEarly = false;
        let errorNote = "";

        try {
          const events: AsyncGenerator<AiEvent> = adapter.streamChat({
            apiKey,
            model: thread.model,
            system: systemPrompt(),
            turns,
            maxTokens: MAX_ANSWER_TOKENS,
            // The route's own signal: fires when the member hits "Zaustavi"
            // or their connection drops, and aborts the provider call so
            // their tokens stop burning server-side too.
            signal: request.signal,
          });

          for await (const event of events) {
            if (event.type === "text") {
              accumulated += event.text;
              controller.enqueue(frame({ type: "token", text: event.text }));
            } else if (event.type === "refusal") {
              // The provider disowned the answer: whatever text already
              // streamed is not persisted as one.
              accumulated = "";
              errorNote = "Pružatelj je odbio odgovoriti na ovaj zahtjev.";
              controller.enqueue(frame({ type: "error", error: errorNote }));
            }
          }
        } catch (err) {
          if (request.signal.aborted) {
            stoppedEarly = true;
          } else if (err instanceof AiError) {
            errorNote = err.userMessage;
            controller.enqueue(frame({ type: "error", error: errorNote }));
          } else {
            console.error("POST /api/documents/[id]/chat stream error:", redactError(err));
            errorNote = "Došlo je do greške. Pokušaj ponovno.";
            controller.enqueue(frame({ type: "error", error: errorNote }));
          }
        } finally {
          // Persisted whatever happened: a full answer, a partial one cut
          // off by a disconnect, or an empty row carrying the error note.
          const { data: saved } = await supabase
            .from("chat_messages")
            .insert({
              thread_id: threadId,
              role: "assistant",
              body: accumulated,
              stopped_early: stoppedEarly,
              error_note: errorNote,
            })
            .select()
            .single();

          if (!request.signal.aborted) {
            if (!errorNote) {
              controller.enqueue(frame({ type: "done", message: saved ?? null }));
            }
            controller.close();
          } else {
            try {
              controller.close();
            } catch {
              // The controller may already be errored by the abort.
            }
          }
        }
      },
    });

    return new Response(stream, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        // no-transform matters as much as no-cache: a proxy that buffers or
        // compresses this response turns streaming into one late lump.
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (err) {
    console.error("POST /api/documents/[id]/chat error:", redactError(err));
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
