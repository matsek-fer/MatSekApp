import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
  });

  return transporter;
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

export function verificationEmailTemplate(
  fullName: string,
  verifyUrl: string
): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #364fc7;">Dobrodošli u Math Club FER!</h2>
      <p>Bok ${fullName},</p>
      <p>Hvala ti na registraciji. Klikni na donji link kako bi verificirao/la svoj račun:</p>
      <a href="${verifyUrl}"
         style="display: inline-block; background: #4c6ef5; color: white;
                padding: 12px 24px; text-decoration: none; border-radius: 6px;
                margin: 16px 0;">
        Verificiraj račun
      </a>
      <p style="color: #666; font-size: 14px;">
        Ako nisi ti registrirao/la ovaj račun, možeš ignorirati ovaj mail.
      </p>
    </div>
  `;
}

export function activityStatusEmailTemplate(
  fullName: string,
  activityTitle: string,
  status: "approved" | "rejected",
  adminComment: string,
  activityUrl: string
): string {
  const statusText = status === "approved" ? "ODOBRENA" : "ODBIJENA";
  const color = status === "approved" ? "#2b8a3e" : "#c92a2a";

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: ${color};">Aktivnost ${statusText}</h2>
      <p>Bok ${fullName},</p>
      <p>Tvoja aktivnost <strong>"${activityTitle}"</strong> je <strong>${statusText.toLowerCase()}</strong>.</p>
      ${
        adminComment
          ? `<p><strong>Komentar admina:</strong> ${adminComment}</p>`
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
