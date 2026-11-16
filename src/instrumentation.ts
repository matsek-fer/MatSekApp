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
  // Read through a variable, never as `process.env.NEXT_PUBLIC_X`: the build
  // inlines static member access to the value it saw at build time, and this
  // check is about what the server was started with. (In the Docker build
  // both come from the same deploy/.env, so they agree.)
  const read = (name: string) => process.env[name] ?? "";

  for (const name of [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "SMTP_HOST",
    "SMTP_USER",
    "SMTP_PASS",
    "SMTP_FROM",
    "NEXT_PUBLIC_APP_URL",
  ]) {
    if (!read(name)) problems.push(`${name} is not set`);
  }

  const appUrl = read("NEXT_PUBLIC_APP_URL");
  if (/localhost|127\.0\.0\.1/.test(appUrl)) {
    problems.push(`NEXT_PUBLIC_APP_URL is ${appUrl}; every link in every email would point there`);
  } else if (appUrl && !appUrl.startsWith("https://")) {
    problems.push(`NEXT_PUBLIC_APP_URL should be an https origin, got ${appUrl}`);
  }

  if (
    /your-project|your-anon-key|your-service-role-key|your-smtp-password/.test(
      ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY", "SMTP_PASS"]
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
