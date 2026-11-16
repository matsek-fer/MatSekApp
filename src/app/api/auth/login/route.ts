import type { NextRequest } from "next/server";
import { asService } from "@/lib/db";
import { normalizeEmail, underLimit } from "@/lib/auth/codes";
import { burnPasswordCheck, verifyPassword } from "@/lib/auth/password";
import { startSession } from "@/lib/auth/session";
import { fail, ok, readBody, SERVER_ERROR, str, TOO_MANY } from "@/lib/auth/http";

const BAD_LOGIN = "Neispravan email ili lozinka.";

/**
 * POST /api/auth/login
 *
 * Body: { email, password }
 *
 * Sets the session cookie on success. Throttled per address, which is what
 * stands between a leaked password list and the login form. An unconfirmed
 * account is refused — but only after the password checks out, so the
 * "confirm your email" answer tells nothing to someone who does not already
 * know the password.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await readBody(request);
    const email = normalizeEmail(body.email);
    const password = str(body.password);

    if (!email || !password) return fail(400, "Email i lozinka su obavezni.");

    const allowed = await asService((tx) =>
      underLimit(tx, `login:${email}`, 10, 15 * 60)
    );
    if (!allowed) return fail(429, TOO_MANY);

    const [user] = await asService(
      (tx) => tx<{ id: string; encrypted_password: string; confirmed: boolean }[]>`
        SELECT id, encrypted_password, email_confirmed_at IS NOT NULL AS confirmed
        FROM auth.users WHERE lower(email) = ${email}
      `
    );

    if (!user) {
      await burnPasswordCheck(password);
      return fail(400, BAD_LOGIN);
    }
    if (!(await verifyPassword(password, user.encrypted_password))) {
      return fail(400, BAD_LOGIN);
    }
    if (!user.confirmed) {
      return fail(
        403,
        "Email još nije verificiran. Upiši kod iz maila na stranici za verifikaciju."
      );
    }

    await asService((tx) => startSession(tx, user.id));
    return ok("Prijava uspješna.");
  } catch (err) {
    console.error("Login error:", err);
    return fail(500, SERVER_ERROR);
  }
}
