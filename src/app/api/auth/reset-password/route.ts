import type { NextRequest } from "next/server";
import { asService } from "@/lib/db";
import { normalizeEmail, redeemCode } from "@/lib/auth/codes";
import {
  hashPassword,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
} from "@/lib/auth/password";
import { endAllSessions, startSession } from "@/lib/auth/session";
import { BAD_CODE, fail, ok, readBody, SERVER_ERROR, str } from "@/lib/auth/http";

/**
 * POST /api/auth/reset-password
 *
 * Body: { email, token, password }
 *
 * Redeems the recovery code and sets the new password in one transaction —
 * the code is what proves the mailbox belongs to whoever is calling, so the
 * two cannot be separated. Every existing session is ended (a reset is often
 * a response to someone else having the old password) and a fresh one is
 * started here, which is why the page can go straight to the calendar.
 *
 * Redeeming a recovery code also confirms the address, for the same reason
 * a signup code does.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await readBody(request);
    const email = normalizeEmail(body.email);
    const token = str(body.token);
    const password = str(body.password);

    if (!email || !token || !password) {
      return fail(400, "Email, kod i nova lozinka su obavezni.");
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      return fail(400, `Lozinka mora imati barem ${MIN_PASSWORD_LENGTH} znakova.`);
    }
    if (password.length > MAX_PASSWORD_LENGTH) {
      return fail(400, `Lozinka smije imati najviše ${MAX_PASSWORD_LENGTH} znakova.`);
    }

    const passwordHash = await hashPassword(password);

    const changed = await asService(async (tx) => {
      const [user] = await tx<{ id: string }[]>`
        SELECT id FROM auth.users WHERE lower(email) = ${email}
      `;
      if (!user || !(await redeemCode(tx, user.id, "recovery", token))) return false;

      await tx`
        UPDATE auth.users
        SET encrypted_password = ${passwordHash},
            email_confirmed_at = coalesce(email_confirmed_at, now())
        WHERE id = ${user.id}
      `;
      await endAllSessions(tx, user.id);
      await startSession(tx, user.id);
      return true;
    });

    return changed ? ok("Lozinka je promijenjena.") : fail(400, BAD_CODE);
  } catch (err) {
    console.error("Reset password error:", err);
    return fail(500, SERVER_ERROR);
  }
}
