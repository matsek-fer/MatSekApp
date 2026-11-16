import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth/cookie";

/**
 * Renews the session cookie on every page and turns visitors without one
 * away from the pages that need it.
 *
 * It runs on the Edge runtime, which cannot open a Postgres connection, so
 * it only asks whether a session cookie is present. Whether the session is
 * real, unexpired and whose it is gets decided on the server by
 * getCurrentUser(): requireUser() on the guarded pages, requireAdmin() in the
 * admin layout, and RLS under every query either way. The renewal is the
 * cookie half of the sliding expiry whose database half lives in
 * getCurrentUser(); Server Components cannot write cookies, so it is done
 * here.
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
/** The edit form — the one guarded page with an id in the middle of its path. */
const PROTECTED_EDIT = /^\/activities\/[^/]+\/edit$/;

function isProtected(pathname: string) {
  return (
    PROTECTED.some((p) => pathname === p || pathname.startsWith(p + "/")) ||
    PROTECTED_EDIT.test(pathname)
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  // Redirect visitors without a session, remembering where they were headed.
  if (isProtected(pathname) && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.next();
  // Pages only: an /api route may itself be setting or clearing this cookie
  // (login, logout, reset), and a renewal here would race its Set-Cookie.
  if (token && !pathname.startsWith("/api")) {
    response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  }
  return response;
}

export const config = {
  // Every page, so the session refresh above reaches public ones too; only
  // the static files are left out.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|woff2?|ttf|pdf|mjs)$).*)",
  ],
};
