import type { NextRequest } from "next/server";
import { asService } from "@/lib/db";
import { issueCode, normalizeEmail, underLimit } from "@/lib/auth/codes";
import {
  hashPassword,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
} from "@/lib/auth/password";
import { fail, ok, readBody, SERVER_ERROR, str, TOO_MANY } from "@/lib/auth/http";
import { sendEmail, signupCodeEmailTemplate } from "@/lib/email";
import { ALLOWED_EMAIL_DOMAINS, isAllowedEmail } from "@/lib/validation";

const MAX_NAME_LENGTH = 200;
const SENT = "Registracija uspješna! Provjeri svoj inbox za verifikacijski kod.";

/**
 * POST /api/auth/register
 *
 * Body: { email, password, full_name }
 *
 * Creates the account unconfirmed and mails a six-digit code for /verify.
 * The domain lock is checked here for a readable error and enforced again
 * by the restrict_email_domain trigger, which is the one that cannot be
 * skipped.
 *
 * Registering an address that already has a confirmed account answers
 * exactly like a new signup and sends nothing, so the form cannot be used to
 * test who is a member. An unconfirmed one is taken over — new password, new
 * code — since whoever lost the first code is most likely its owner, and the
 * account stays useless to anyone else until the mailbox confirms it.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await readBody(request);
    const email = normalizeEmail(body.email);
    const password = str(body.password);
    const fullName = str(body.full_name).trim().slice(0, MAX_NAME_LENGTH);

    if (!email || !password || !fullName) {
      return fail(400, "Sva polja su obavezna.");
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      return fail(400, `Lozinka mora imati barem ${MIN_PASSWORD_LENGTH} znakova.`);
    }
    if (password.length > MAX_PASSWORD_LENGTH) {
      return fail(400, `Lozinka smije imati najviše ${MAX_PASSWORD_LENGTH} znakova.`);
    }
    if (!isAllowedEmail(email)) {
      return fail(
        400,
        `Dozvoljene su samo ${ALLOWED_EMAIL_DOMAINS.join(" i ")} email adrese.`
      );
    }

    // Hashed before the transaction opens: ~50 ms of scrypt is not worth
    // holding a pooled connection for.
    const passwordHash = await hashPassword(password);

    const outcome = await asService(async (tx) => {
      if (!(await underLimit(tx, `send-code:${email}`, 5, 60 * 60))) {
        return "throttled" as const;
      }

      const [existing] = await tx<{ id: string; confirmed: boolean }[]>`
        SELECT id, email_confirmed_at IS NOT NULL AS confirmed
        FROM auth.users WHERE lower(email) = ${email}
      `;
      if (existing?.confirmed) return "silent" as const;

      let userId: string;
      if (existing) {
        userId = existing.id;
        await tx`
          UPDATE auth.users
          SET encrypted_password = ${passwordHash},
              raw_user_meta_data = ${tx.json({ full_name: fullName })}
          WHERE id = ${userId}
        `;
        await tx`UPDATE public.profiles SET full_name = ${fullName} WHERE id = ${userId}`;
      } else {
        // The on_auth_user_created trigger makes the profile from the
        // metadata, as it did under Supabase.
        const [created] = await tx<{ id: string }[]>`
          INSERT INTO auth.users (email, encrypted_password, raw_user_meta_data)
          VALUES (${email}, ${passwordHash}, ${tx.json({ full_name: fullName })})
          RETURNING id
        `;
        userId = created.id;
      }

      return { code: await issueCode(tx, userId, "signup") };
    });

    if (outcome === "throttled") return fail(429, TOO_MANY);

    if (outcome !== "silent") {
      const sent = await sendEmail({
        to: email,
        subject: "Verifikacijski kod — Math Club FER",
        html: signupCodeEmailTemplate(fullName, outcome.code),
      });
      if (!sent) {
        return fail(502, "Slanje maila s kodom nije uspjelo. Pokušaj ponovno.");
      }
    }

    return ok(SENT, 201);
  } catch (err) {
    console.error("Register error:", err);
    return fail(500, SERVER_ERROR);
  }
}
