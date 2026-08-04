import { createClient as createServerClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";
import { getAdapter } from "@/lib/ai";
import { sealApiKey } from "@/lib/ai/crypto";
import { AiError, redactError } from "@/lib/ai/errors";
import { keyCookieName, keyCookieOptions, loadUserKeySuffix } from "@/lib/ai/keys";
import { checkThrottle, THROTTLES } from "@/lib/ai/throttle";
import { isAiProvider, MAX_API_KEY_LENGTH } from "@/lib/validation";
import { AI_PROVIDERS } from "@/lib/ai";
import type { AiKeyInfo } from "@/lib/ai/types";
import type { ApiResponse } from "@/types";

/**
 * The member's provider keys.
 *
 * Two rules this file exists to hold:
 *
 *   - No response from here ever carries a key or a sealed key. The only
 *     thing that leaves is the provider name and the last four characters.
 *     Do not add a field to change that.
 *   - Nothing here logs a caught error directly. Provider SDKs hang the
 *     originating request off their errors, and that request carries the
 *     member's key in a header. Everything goes through redactError.
 */

/** GET /api/ai/keys — which providers this member has a key saved for. */
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

    const keys: AiKeyInfo[] = [];
    for (const provider of AI_PROVIDERS) {
      const suffix = loadUserKeySuffix(session.user.id, provider);
      if (suffix) keys.push({ provider, suffix });
    }

    return NextResponse.json<ApiResponse<AiKeyInfo[]>>(
      { success: true, data: keys },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /api/ai/keys error:", redactError(err));
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ai/keys — save a key for one provider.
 *
 * The key is checked against the provider before it is stored. A key that
 * does not work is a typo the member can fix now, rather than a failure they
 * meet later in the middle of reading.
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

    // Throttled BEFORE anything reads the body: each validation makes a real
    // authenticated call to a provider, so an unthrottled version of this
    // route is a free oracle for testing stolen keys. Five an hour is ample
    // for a member correcting a typo.
    const refused = await checkThrottle(supabase, THROTTLES.keyVerify);
    if (refused) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: refused },
        { status: 429 }
      );
    }

    const body = (await request.json()) as Record<string, unknown>;
    const { provider, apiKey } = body;

    if (!isAiProvider(provider)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Nepoznat pružatelj." },
        { status: 400 }
      );
    }

    if (typeof apiKey !== "string" || apiKey.trim().length === 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "API ključ je obavezan." },
        { status: 400 }
      );
    }

    const trimmed = apiKey.trim();
    if (trimmed.length > MAX_API_KEY_LENGTH) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "API ključ je predug." },
        { status: 400 }
      );
    }

    try {
      await getAdapter(provider).validateKey(trimmed);
    } catch (err) {
      if (err instanceof AiError) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: err.userMessage },
          { status: err.status }
        );
      }
      throw err;
    }

    const response = NextResponse.json<ApiResponse<AiKeyInfo>>(
      { success: true, data: { provider, suffix: trimmed.slice(-4) } },
      { status: 200 }
    );

    response.cookies.set(
      keyCookieName(provider),
      sealApiKey(trimmed, session.user.id, provider),
      keyCookieOptions()
    );

    return response;
  } catch (err) {
    console.error("POST /api/ai/keys error:", redactError(err));
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
