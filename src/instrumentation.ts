/**
 * Runs once when the server boots.
 *
 * Every variable the app needs is read lazily at its point of use, so a
 * deployment with a missing or placeholder value starts fine and fails
 * later, quietly: approval emails with links to localhost, a mail
 * transport that cannot connect. The checks here turn that into one loud
 * failure at start-up, which is when someone is watching.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs" || process.env.NODE_ENV !== "production") return;

  const problems: string[] = [];
  // Read through a variable rather than `process.env.X`, so nothing here can
  // be inlined at build time: the check is about what the server was
  // started with, which is the only place configuration comes from.
  const read = (name: string) => process.env[name] ?? "";

  for (const name of [
    "DATABASE_URL",
    "S3_BUCKET",
    "S3_ACCESS_KEY_ID",
    "S3_SECRET_ACCESS_KEY",
    "SMTP_HOST",
    "SMTP_USER",
    "SMTP_PASS",
    "SMTP_FROM",
    "APP_URL",
  ]) {
    if (!read(name)) problems.push(`${name} is not set`);
  }

  const appUrl = read("APP_URL");
  if (/localhost|127\.0\.0\.1/.test(appUrl)) {
    problems.push(`APP_URL is ${appUrl}; every link in every email would point there`);
  } else if (appUrl && !appUrl.startsWith("https://")) {
    problems.push(`APP_URL should be an https origin, got ${appUrl}`);
  }

  if (
    /your-app-db-password|your-access-key|your-secret-key|your-smtp-password/.test(
      ["DATABASE_URL", "S3_ACCESS_KEY_ID", "S3_SECRET_ACCESS_KEY", "SMTP_PASS"]
        .map(read)
        .join(" ")
    )
  ) {
    problems.push("a placeholder from .env.local.example is still in the environment");
  }

  if (problems.length) {
    console.error("Refusing to start:\n  - " + problems.join("\n  - "));
    process.exit(1);
  }
}
