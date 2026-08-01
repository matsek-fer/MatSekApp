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

  // A fixed height, not a minimum: the tree section below sizes itself to the
  // room that is left over, so the page is meant to fit on one screen and never
  // scroll. dvh rather than vh so a phone's collapsing URL bar does not push
  // the bottom of the page out of view.
  return (
    <main className="flex h-[100dvh] flex-col items-center overflow-hidden bg-bg">
      <div className="relative flex w-full shrink-0 flex-col items-center px-4 pb-2 pt-3 sm:pt-5">
        <div className="absolute right-4 top-4">
          <ThemeToggle />
        </div>

        {/* The dark-mode logo variant carries its own contrast — no backlight
            hacks needed behind the artwork. Kept modest on purpose: every pixel
            the wordmark takes is a pixel of tree. */}
        <Logo size="lg" width={380} className="w-full max-w-[300px] sm:max-w-[380px]" />

        <div className="mt-4 flex flex-wrap justify-center gap-3">
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
        className="shrink-0 pb-4 text-brand hover:underline sm:pb-6"
      >
        Pogledaj kalendar aktivnosti →
      </Link>
    </main>
  );
}
