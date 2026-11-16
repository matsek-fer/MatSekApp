import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { SESSION_COOKIE_OPTIONS } from "./cookie-options";

/**
 * Supabase server client — for Server Components, Route Handlers and
 * Server Actions. It carries the visitor's session cookie and nothing
 * more, so every query it makes is subject to RLS.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: SESSION_COOKIE_OPTIONS,
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component, which cannot write cookies.
            // Harmless: the middleware runs on every page and writes a
            // refreshed session back before this is reached.
          }
        },
      },
    }
  );
}

/**
 * Supabase admin client — uses service_role key.
 * ONLY use in secure server contexts (API routes, never exposed to client).
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
