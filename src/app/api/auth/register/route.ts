import { createClient as createServerClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";
import { isAllowedEmail } from "@/lib/validation";
import type { ApiResponse } from "@/types";

/**
 * POST /api/auth/register
 *
 * Body: { email: string; password: string; full_name: string }
 *
 * 1. Domain lock is enforced by PostgreSQL trigger (restrict_email_domain).
 * 2. Creates user in Supabase Auth → trigger creates profiles row.
 * 3. Sends verification email.
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password, full_name } = await request.json();

    if (!email || !password || !full_name) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Sva polja su obavezna." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Lozinka mora imati barem 8 znakova." },
        { status: 400 }
      );
    }

    if (!isAllowedEmail(email)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Dozvoljene su samo @fer.hr i @student.fer.hr email adrese.",
        },
        { status: 400 }
      );
    }

    const supabase = createServerClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name },
        // No emailRedirectTo — we want token-based verification via email
      },
    });

    if (error) {
      // PostgreSQL trigger will surface domain-lock errors here
      return NextResponse.json<ApiResponse>(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    // signUp() already dispatches the confirmation mail. Calling resend() here
    // as well delivered two codes and burned the per-address rate limit.

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          message:
            "Registracija uspješna. Provjeri svoj inbox za verifikacijski mail.",
          user_id: data.user?.id,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
