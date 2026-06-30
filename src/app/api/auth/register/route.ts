import { createClient as createServerClient } from "@/lib/supabase/server";
import { verificationEmailTemplate, sendEmail } from "@/lib/email";
import { NextResponse, type NextRequest } from "next/server";
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

    // Generate verification link using Supabase's built-in mechanism
    // (we can also use a custom token flow; standard Verify OTP is simplest)
    const { data: verifyData, error: verifyError } =
      await supabase.auth.resend({
        type: "signup",
        email,
      });

    // Alternative: send custom email with verification link
    // const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify?token=...`;
    // await sendEmail({
    //   to: email,
    //   subject: "Verificiraj svoj Math Club FER račun",
    //   html: verificationEmailTemplate(full_name, verifyUrl),
    // });

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
