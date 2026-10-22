import { createClient as createServerClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";
import type { ApiResponse } from "@/types";

const MIN_PASSWORD = 8;

/**
 * POST /api/auth/reset-password
 *
 * Body: { email: string; token: string; password: string }
 *
 * Redeems the recovery code and sets the new password. The code is what proves
 * the mailbox belongs to whoever is calling, and the session it mints is what
 * authorises the change — so the two steps cannot be separated.
 */
export async function POST(request: NextRequest) {
  try {
    const { email, token, password } = await request.json();

    if (!email || !token || !password) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Email, kod i nova lozinka su obavezni." },
        { status: 400 }
      );
    }

    if (String(password).length < MIN_PASSWORD) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: `Lozinka mora imati barem ${MIN_PASSWORD} znakova.`,
        },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    const { error: otpError } = await supabase.auth.verifyOtp({
      email: String(email).trim(),
      token: String(token).trim(),
      type: "recovery",
    });

    if (otpError) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: otpError.message },
        { status: 400 }
      );
    }

    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: updateError.message },
        { status: 400 }
      );
    }

    return NextResponse.json<ApiResponse>(
      { success: true, data: { message: "Lozinka je promijenjena." } },
      { status: 200 }
    );
  } catch (err) {
    console.error("Reset password error:", err);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
