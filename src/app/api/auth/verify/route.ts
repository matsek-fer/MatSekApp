import { createClient as createServerClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";
import type { ApiResponse } from "@/types";

/**
 * POST /api/auth/verify
 *
 * Body: { email: string; token: string }
 *
 * Verifies the user's email using the OTP token sent by Supabase.
 */
export async function POST(request: NextRequest) {
  try {
    const { email, token } = await request.json();

    if (!email || !token) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Email i token su obavezni." },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "signup",
    });

    if (error) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json<ApiResponse>(
      { success: true, data: { message: "Email uspješno verificiran." } },
      { status: 200 }
    );
  } catch (err) {
    console.error("Verify error:", err);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
