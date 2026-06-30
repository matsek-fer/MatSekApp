import Link from "next/link";
import Image from "next/image";
import { createClient as createServerClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/auth/LogoutButton";

export default async function HomePage() {
  const supabase = createServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-br from-brand-50 to-white">
      {/* ── TOP: Logo + links ── */}
      <div className="flex flex-col items-center pt-4 sm:pt-8 pb-4 px-4">
        <Image
          src="/logo.png"
          alt="MATSEK — Matematička sekcija"
          width={520}
          height={200}
          className="h-auto w-full max-w-[500px] sm:max-w-[560px]"
          priority
          unoptimized
        />

        <div className="flex gap-4 justify-center mt-5">
          {session ? (
            <>
              <Link
                href="/calendar"
                className="px-6 py-3 bg-brand-600 text-white rounded-lg
                           hover:bg-brand-700 transition-colors font-medium"
              >
                Kalendar
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/register"
                className="px-6 py-3 bg-brand-600 text-white rounded-lg
                           hover:bg-brand-700 transition-colors font-medium"
              >
                Registriraj se
              </Link>
              <Link
                href="/login"
                className="px-6 py-3 border border-brand-300 text-brand-700
                           rounded-lg hover:bg-brand-50 transition-colors font-medium"
              >
                Prijavi se
              </Link>
            </>
          )}
        </div>
      </div>

      {/* ── MIDDLE: Big box ── */}
      <div className="flex-1 w-[70%] max-w-4xl mx-4 mb-6 border border-black rounded-2xl bg-white" />

      {/* ── BOTTOM: Calendar link ── */}
      <Link
        href="/calendar"
        className="text-brand-600 hover:underline pb-6 sm:pb-10"
      >
        Pogledaj kalendar aktivnosti →
      </Link>
    </main>
  );
}
