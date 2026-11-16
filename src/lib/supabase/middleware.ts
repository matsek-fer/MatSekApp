import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_OPTIONS } from "./cookie-options";

/**
 * The Supabase client for the middleware. There is no cookies() store to
 * write to there: a session the client refreshes has to be put onto the
 * response by hand, and onto the request as well, so the Server Components
 * rendered after the middleware read the new token rather than the expired
 * one. `response()` is the response to return, or to copy cookies from
 * when the middleware answers with a redirect instead.
 */
export function createClient(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: SESSION_COOKIE_OPTIONS,
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  return { supabase, response: () => response };
}

/** A redirect that keeps whatever cookies the session refresh set. */
export function redirectWith(from: NextResponse, url: URL) {
  const target = NextResponse.redirect(url);
  from.cookies.getAll().forEach((cookie) => target.cookies.set(cookie));
  return target;
}
