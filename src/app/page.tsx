import Link from "next/link";
import { createClient as createServerClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/auth/LogoutButton";
import ContentPanel from "@/components/landing/ContentPanel";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Logo from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { randomSeed } from "@/lib/ascii-tree";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = createServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <main className="flex min-h-screen flex-col items-center bg-bg">
      <div className="relative flex w-full flex-col items-center px-4 pb-4 pt-4 sm:pt-8">
        <div className="absolute right-4 top-4">
          <ThemeToggle />
        </div>

        {/* The dark-mode logo variant carries its own contrast — no backlight
            hacks needed behind the artwork. */}
        <Logo size="lg" width={520} className="w-full max-w-[500px] sm:max-w-[560px]" />

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {session ? (
            <>
              <ButtonLink href="/calendar" size="lg">
                Kalendar
              </ButtonLink>
              <LogoutButton />
            </>
          ) : (
            <>
              <ButtonLink href="/register" size="lg">
                Registriraj se
              </ButtonLink>
              <ButtonLink href="/login" size="lg" variant="secondary">
                Prijavi se
              </ButtonLink>
            </>
          )}
        </div>
      </div>

      {/* Seeded here so the server render and hydration agree on the first tree. */}
      <ContentPanel initialSeed={randomSeed()} />

      <Link
        href="/calendar"
        className="pb-6 text-brand hover:underline sm:pb-10"
      >
        Pogledaj kalendar aktivnosti →
      </Link>
    </main>
  );
}
