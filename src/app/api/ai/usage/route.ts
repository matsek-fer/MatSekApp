import { createClient as createServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { ApiResponse } from "@/types";

/**
 * GET /api/ai/usage — today's meter for the panel header.
 *
 * "Today" is the last 24 hours, not the calendar day: the point is "is
 * something running away right now", and a midnight reset would hide a spike
 * that started at 23:50. RLS scopes the rows to the caller.
 */
export interface AiUsageSummary {
  calls: number;
  answer_chars: number;
}

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

    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { data: events, error } = await supabase
      .from("ai_usage_events")
      .select("answer_chars")
      .gte("created_at", since);

    if (error) {
      console.error("GET /api/ai/usage error:", error);
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Potrošnju nije moguće dohvatiti." },
        { status: 500 }
      );
    }

    const rows = events ?? [];
    return NextResponse.json<ApiResponse<AiUsageSummary>>(
      {
        success: true,
        data: {
          calls: rows.length,
          answer_chars: rows.reduce((sum, r) => sum + (r.answer_chars ?? 0), 0),
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /api/ai/usage error:", err);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
