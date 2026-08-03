import { createClient as createServerClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";
import { redactError } from "@/lib/ai/errors";
import { keyCookieName } from "@/lib/ai/keys";
import { isAiProvider } from "@/lib/validation";
import type { ApiResponse } from "@/types";

/**
 * DELETE /api/ai/keys/[provider]
 *
 * Forgets the key on our side. It does not — and cannot — revoke it at the
 * provider, which is why the success message says so.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { provider: string } }
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

    const { provider } = params;
    if (!isAiProvider(provider)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Nepoznat pružatelj." },
        { status: 400 }
      );
    }

    const response = NextResponse.json<ApiResponse<{ message: string }>>(
      {
        success: true,
        data: {
          message:
            "Ključ je uklonjen. Opozovi ga i kod pružatelja ako ga više ne koristiš.",
        },
      },
      { status: 200 }
    );

    response.cookies.delete(keyCookieName(provider));

    return response;
  } catch (err) {
    console.error("DELETE /api/ai/keys/[provider] error:", redactError(err));
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
