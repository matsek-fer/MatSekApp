import { createClient as createServerClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Middleware: refreshes the Supabase session on every request.
 * Protects /dashboard/* routes (redirect to /login if unauthenticated).
 * Protects /admin/* routes (redirect to / if not admin).
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Routes that need a session even though they sit under a public prefix.
  const isProtectedException = pathname === "/activities/new";

  // Allow public routes and static assets
  if (
    !isProtectedException &&
    (pathname.startsWith("/api") ||
      pathname === "/" ||
      pathname === "/calendar" ||
      pathname.startsWith("/activities") ||
      pathname.startsWith("/login") ||
      pathname.startsWith("/register") ||
      pathname.startsWith("/verify") ||
      // Both halves of the password reset have to be reachable signed out —
      // that is the whole situation the user is in.
      pathname.startsWith("/forgot-password") ||
      pathname.startsWith("/reset-password") ||
      pathname.startsWith("/_next") ||
      pathname.startsWith("/favicon") ||
      // pdf.js fetches its worker from the page. It is a library file with
      // nothing of anyone's in it, and redirecting it to /login breaks the
      // reader for a member who is in fact signed in.
      pathname === "/pdf.worker.min.mjs" ||
      /\.(png|jpg|jpeg|gif|svg|webp|ico|woff2?|ttf|eot)$/.test(pathname))
  ) {
    return NextResponse.next();
  }

  const supabase = createServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Redirect unauthenticated users, remembering where they were headed.
  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin route protection
  if (pathname.startsWith("/admin")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.redirect(new URL("/calendar", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
