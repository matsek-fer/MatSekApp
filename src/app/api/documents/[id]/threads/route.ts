import { createClient as createServerClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";
import { defaultModel, listModels } from "@/lib/ai";
import { isAiProvider } from "@/lib/validation";
import type { ApiResponse, ChatThread } from "@/types";

/**
 * A document's conversations.
 *
 * The document is fetched first on both verbs — through RLS, so another
 * member's id yields nothing — and every thread operation hangs off that.
 * The thread INSERT policy re-proves document ownership in the database,
 * which makes the check here a courtesy 404 rather than the enforcement.
 */

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

    const { data: document } = await supabase
      .from("documents")
      .select("id")
      .eq("id", params.id)
      .single();

    if (!document) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Dokument nije pronađen." },
        { status: 404 }
      );
    }

    const { data: threads, error } = await supabase
      .from("chat_threads")
      .select("*")
      .eq("document_id", params.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("GET /api/documents/[id]/threads error:", error);
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Razgovore nije moguće dohvatiti." },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<ChatThread[]>>(
      { success: true, data: (threads ?? []) as ChatThread[] },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /api/documents/[id]/threads error:", err);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

/** POST /api/documents/[id]/threads — start a conversation. */
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
    const { provider } = body;

    if (!isAiProvider(provider)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Nepoznat pružatelj." },
        { status: 400 }
      );
    }

    // The model id arrives from the browser and will eventually be sent to a
    // vendor SDK on the member's own key, so it is checked against the
    // server-owned allowlist — never trusted as a free string.
    const model =
      typeof body.model === "string" ? body.model : defaultModel(provider);
    if (!listModels(provider).some((m) => m.id === model)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Nepoznat model." },
        { status: 400 }
      );
    }

    const { data: document } = await supabase
      .from("documents")
      .select("id, status")
      .eq("id", params.id)
      .single();

    if (!document) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Dokument nije pronađen." },
        { status: 404 }
      );
    }

    if (document.status !== "ready") {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Dokument još nije obrađen." },
        { status: 409 }
      );
    }

    const { data: thread, error } = await supabase
      .from("chat_threads")
      .insert({
        document_id: params.id,
        owner_id: session.user.id,
        provider,
        model,
      })
      .select()
      .single();

    if (error || !thread) {
      console.error("POST /api/documents/[id]/threads error:", error);
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Razgovor nije moguće stvoriti." },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<ChatThread>>(
      { success: true, data: thread as ChatThread },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/documents/[id]/threads error:", err);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
