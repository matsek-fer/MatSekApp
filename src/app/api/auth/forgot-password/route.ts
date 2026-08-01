import { createClient as createServerClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";
import type { ApiResponse } from "@/types";

/**
 * POST /api/auth/forgot-password
 *
 * Body: { email: string }
 *
 * Sends a password-recovery mail. The reply is the same whether or not the
 * address has an account: answering differently would turn this into a
 * membership check for anyone willing to type.
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Email je obavezan." },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    const { error } = await supabase.auth.resetPasswordForEmail(
      String(email).trim()
    );

    // Supabase only errors here for a malformed address or a tripped rate
    // limit — never for an unknown user — so surfacing it leaks nothing.
    if (error) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          message:
            "Ako račun s tom adresom postoji, poslali smo kod za promjenu lozinke.",
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
