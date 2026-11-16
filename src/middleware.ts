import { createClient as createMiddlewareClient, redirectWith } from "@/lib/supabase/middleware";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refreshes the session on every page and guards the pages that need one.
 *
 * It runs on every non-static request because a Server Component cannot
 * write cookies: when the access token has expired, the server client
 * refreshes it in memory and the rotated refresh token would be thrown away,
 * and the browser would keep presenting the old one — which Supabase
 * tolerates only for a few seconds before it revokes the whole token family
 * and signs the member out everywhere. Here the refreshed cookies go onto
 * the response. With no session cookie at all this costs nothing: no
 * network call is made.
 *
 * The guarded pages are listed, not the public ones: everything else — the
 * calendar, the materials, the auth pages, and any URL that does not exist —
 * passes through, so a mistyped address gets the 404 page rather than a
 * redirect to the login form. The data behind every page is guarded by RLS
 * in any case; this only decides who sees the forms.
 *
 * The API routes check the session themselves and answer 401, which a fetch
 * can act on; a redirect to an HTML page would not be.
 */
const PROTECTED = ["/activities/new", "/admin", "/notifications", "/profile"];

function isProtected(pathname: string) {
  return PROTECTED.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const { supabase, response } = createMiddlewareClient(request);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!isProtected(pathname)) return response();

  // Redirect unauthenticated users, remembering where they were headed.
  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return redirectWith(response(), loginUrl);
  }

  // Admin route protection. getUser() rather than the session's user: the
  // session is parsed from the cookie, not verified, and reading its user on
  // the server logs a warning per request — getUser() checks the token with
  // Supabase Auth and is only paid for on the admin pages.
  if (pathname.startsWith("/admin")) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data: profile } = user
      ? await supabase.from("profiles").select("role").eq("id", user.id).single()
      : { data: null };

    if (profile?.role !== "admin") {
      return redirectWith(response(), new URL("/calendar", request.url));
    }
  }

  return response();
}

export const config = {
  // Every page, so the session refresh above reaches public ones too; only
  // the static files are left out.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|woff2?|ttf|pdf|mjs)$).*)",
  ],
};
