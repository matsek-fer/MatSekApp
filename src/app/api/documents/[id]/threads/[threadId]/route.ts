import { createClient as createServerClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";
import type { ApiResponse, ChatMessage, ChatThread } from "@/types";

/**
 * One thread's transcript. RLS scopes both queries to the owner, so a
 * guessed thread id — like a guessed document id — is a plain 404.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; threadId: string } }
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

    const { data: thread } = await supabase
      .from("chat_threads")
      .select("*")
      .eq("id", params.threadId)
      .eq("document_id", params.id)
      .single();

    if (!thread) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Razgovor nije pronađen." },
        { status: 404 }
      );
    }

    const { data: messages, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("thread_id", params.threadId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("GET /api/documents/[id]/threads/[threadId] error:", error);
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Poruke nije moguće dohvatiti." },
        { status: 500 }
      );
    }

    return NextResponse.json<
      ApiResponse<{ thread: ChatThread; messages: ChatMessage[] }>
    >(
      {
        success: true,
        data: {
          thread: thread as ChatThread,
          messages: (messages ?? []) as ChatMessage[],
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /api/documents/[id]/threads/[threadId] error:", err);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

/** DELETE — remove a conversation. Messages cascade with the thread. */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; threadId: string } }
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

    const { data: thread } = await supabase
      .from("chat_threads")
      .select("id")
      .eq("id", params.threadId)
      .eq("document_id", params.id)
      .single();

    if (!thread) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Razgovor nije pronađen." },
        { status: 404 }
      );
    }

    const { error } = await supabase
      .from("chat_threads")
      .delete()
      .eq("id", params.threadId);

    if (error) {
      console.error("DELETE /api/documents/[id]/threads/[threadId] error:", error);
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Razgovor nije moguće obrisati." },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<{ message: string }>>(
      { success: true, data: { message: "Razgovor je obrisan." } },
      { status: 200 }
    );
  } catch (err) {
    console.error("DELETE /api/documents/[id]/threads/[threadId] error:", err);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
