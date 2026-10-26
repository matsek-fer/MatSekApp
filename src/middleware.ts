import { createClient as createMiddlewareClient, redirectWith } from "@/lib/supabase/middleware";
import { NextResponse, type NextRequest } from "next/server";

/**
 * The session guard for the pages that need one.
 *
 * The pages are listed, not the public ones: everything else — the calendar,
 * the materials, the auth pages, and any URL that does not exist — passes
 * through, so a mistyped address gets the 404 page rather than a redirect
 * to the login form. The data behind every page is guarded by RLS in any
 * case; this only decides who sees the forms.
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

  if (!isProtected(pathname)) return NextResponse.next();

  const { supabase, response } = createMiddlewareClient(request);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Redirect unauthenticated users, remembering where they were headed.
  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return redirectWith(response(), loginUrl);
  }

  // Admin route protection
  if (pathname.startsWith("/admin")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (profile?.role !== "admin") {
      return redirectWith(response(), new URL("/calendar", request.url));
    }
  }

  return response();
}

export const config = {
  // Only the guarded prefixes, so the Supabase client is not built for every
  // request to a public page or a static file.
  matcher: ["/activities/new", "/admin/:path*", "/notifications/:path*", "/profile/:path*"],
};
