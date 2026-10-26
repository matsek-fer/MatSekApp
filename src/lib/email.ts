import { createTransport, type Transporter } from "nodemailer";

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (transporter) return transporter;

  const port = Number(process.env.SMTP_PORT) || 587;
  transporter = createTransport({
    host: process.env.SMTP_HOST!,
    port,
    secure: port === 465,
    // STARTTLS on 587 is opportunistic by default: a relay that does not
    // offer it would get the password in clear. Insist, so a downgrade
    // fails loudly instead of leaking SMTP_PASS.
    requireTLS: port !== 465,
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
    // An unreachable relay must not hang an approval for the two minutes
    // the OS allows; the approval has already committed by the time the
    // mail goes out, and the admin UI reports the failure.
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });

  return transporter;
}

/** The site's own origin, for links in emails. No trailing slash. */
export function appUrl(): string {
  return (process.env.NEXT_PUBLIC_APP_URL ?? "").replace(/\/+$/, "");
}

/** The templates interpolate names and titles members typed; HTML in them is text, not markup. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams): Promise<boolean> {
  try {
    const t = getTransporter();
    await t.sendMail({
      from: process.env.SMTP_FROM!,
      to,
      subject,
      html,
    });
    return true;
  } catch (error) {
    console.error("Email send failed:", error);
    return false;
  }
}

// ── Pre-built templates ────────────────────────────────────────────────────

export function activityStatusEmailTemplate(
  fullName: string,
  activityTitle: string,
  status: "approved" | "rejected",
  adminComment: string,
  activityUrl: string
): string {
  const statusText = status === "approved" ? "ODOBRENA" : "ODBIJENA";
  const color = status === "approved" ? "#2b8a3e" : "#c92a2a";
  fullName = escapeHtml(fullName);
  activityTitle = escapeHtml(activityTitle);
  adminComment = escapeHtml(adminComment);

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: ${color};">Aktivnost ${statusText}</h2>
      <p>Bok ${fullName},</p>
      <p>Tvoja aktivnost <strong>"${activityTitle}"</strong> je <strong>${statusText.toLowerCase()}</strong>.</p>
      ${
        adminComment
          ? `<p style="white-space: pre-wrap;"><strong>Komentar admina:</strong> ${adminComment}</p>`
          : ""
      }
      <a href="${activityUrl}"
         style="display: inline-block; background: #4c6ef5; color: white;
                padding: 12px 24px; text-decoration: none; border-radius: 6px;
                margin: 16px 0;">
        Pogledaj aktivnost
      </a>
    </div>
  `;
}
