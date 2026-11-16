import type { NextRequest } from "next/server";
import { asService } from "@/lib/db";
import { issueCode, normalizeEmail, underLimit } from "@/lib/auth/codes";
import { fail, ok, readBody, SERVER_ERROR, TOO_MANY } from "@/lib/auth/http";
import { recoveryCodeEmailTemplate, sendEmail } from "@/lib/email";

/**
 * POST /api/auth/forgot-password
 *
 * Body: { email }
 *
 * Mails a recovery code for /reset-password. The reply is the same whether or
 * not the address has an account: answering differently would turn this into
 * a membership check for anyone willing to type. The throttle is keyed by
 * address regardless of whether it exists, so tripping it reveals nothing
 * either.
 */
export async function POST(request: NextRequest) {
  try {
    const email = normalizeEmail((await readBody(request)).email);
    if (!email) return fail(400, "Email je obavezan.");

    const outcome = await asService(async (tx) => {
      if (!(await underLimit(tx, `send-code:${email}`, 5, 60 * 60))) {
        return "throttled" as const;
      }
      const [user] = await tx<{ id: string; full_name: string }[]>`
        SELECT u.id, coalesce(p.full_name, '') AS full_name
        FROM auth.users u LEFT JOIN public.profiles p ON p.id = u.id
        WHERE lower(u.email) = ${email}
      `;
      if (!user) return null;
      return { fullName: user.full_name, code: await issueCode(tx, user.id, "recovery") };
    });

    if (outcome === "throttled") return fail(429, TOO_MANY);

    if (outcome) {
      // Not reported to the caller: a failure here would otherwise be the
      // one reply that only an existing account can produce.
      await sendEmail({
        to: email,
        subject: "Kod za promjenu lozinke — Math Club FER",
        html: recoveryCodeEmailTemplate(outcome.fullName, outcome.code),
      });
    }

    return ok("Ako račun s tom adresom postoji, poslali smo kod za promjenu lozinke.");
  } catch (err) {
    console.error("Forgot password error:", err);
    return fail(500, SERVER_ERROR);
  }
}
