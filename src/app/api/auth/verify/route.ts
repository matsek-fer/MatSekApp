import type { NextRequest } from "next/server";
import { asService } from "@/lib/db";
import { normalizeEmail, redeemCode } from "@/lib/auth/codes";
import { BAD_CODE, fail, ok, readBody, SERVER_ERROR, str } from "@/lib/auth/http";

/**
 * POST /api/auth/verify
 *
 * Body: { email, token }
 *
 * Confirms a new account with the code from its signup mail. Every failure —
 * unknown address, already confirmed, wrong or spent code — gets the same
 * answer, so this cannot be used to probe for accounts either.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await readBody(request);
    const email = normalizeEmail(body.email);
    const token = str(body.token);

    if (!email || !token) return fail(400, "Email i kod su obavezni.");

    const confirmed = await asService(async (tx) => {
      const [user] = await tx<{ id: string }[]>`
        SELECT id FROM auth.users
        WHERE lower(email) = ${email} AND email_confirmed_at IS NULL
      `;
      if (!user || !(await redeemCode(tx, user.id, "signup", token))) return false;

      await tx`UPDATE auth.users SET email_confirmed_at = now() WHERE id = ${user.id}`;
      return true;
    });

    return confirmed ? ok("Email je verificiran.") : fail(400, BAD_CODE);
  } catch (err) {
    console.error("Verify error:", err);
    return fail(500, SERVER_ERROR);
  }
}
