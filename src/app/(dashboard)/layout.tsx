import Link from "next/link";
import { createClient as createServerClient } from "@/lib/supabase/server";
import NotificationBell from "@/components/notifications/NotificationBell";
import VoronoiNavbarLink from "@/components/layout/VoronoiNavbarLink";
import LogoutButton from "@/components/auth/LogoutButton";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { ButtonLink } from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";
import LanguageToggle from "@/components/ui/LanguageToggle";
import { getLang } from "@/lib/i18n/server";
import { CHROME } from "@/lib/i18n/chrome";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: { role: string; full_name: string } | null = null;

  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("role, full_name")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  const isAdmin = profile?.role === "admin";
  const lang = await getLang();
  const t = CHROME[lang];

  return (
    <div className="min-h-screen bg-bg">
      {/* The id is how the reader finds this bar to measure it. Its height is
          not a constant — an extra nav row wraps under `md` — so the reading
          view reads `offsetHeight` rather than hardcoding 4rem. */}
      <nav
        id="app-navbar"
        className="sticky top-0 z-40 border-b border-border bg-surface"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* self-stretch down the chain so the nav links can fill the bar's
                full height; the logo beside them stays vertically centred. */}
            <div className="flex items-center gap-6 self-stretch">
              <Link
                href="/"
                className="shrink-0 rounded-lg"
                aria-label={t.home}
              >
                <Logo width={112} />
              </Link>

              <div className="hidden gap-1 self-stretch md:flex">
                <VoronoiNavbarLink href="/calendar">{t.calendar}</VoronoiNavbarLink>
                <VoronoiNavbarLink href="/materials">{t.materials}</VoronoiNavbarLink>
                <VoronoiNavbarLink href="/library">{t.library}</VoronoiNavbarLink>
                <VoronoiNavbarLink href="/tools">{t.tools}</VoronoiNavbarLink>
                {user && (
                  <VoronoiNavbarLink href="/activities/new">
                    {t.propose}
                  </VoronoiNavbarLink>
                )}
                {isAdmin && (
                  <VoronoiNavbarLink href="/admin" className="text-brand">
                    {t.admin}
                  </VoronoiNavbarLink>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 self-stretch sm:gap-2">
              {/* Under md the toggle moves to the end of the collapsed nav row —
                  the signed-out bar has no room for another control. */}
              <div className="hidden md:block">
                <LanguageToggle lang={lang} label={t.toggleLang} />
              </div>
              <ThemeToggle label={t.toggleTheme} />
              {user ? (
                <>
                  <NotificationBell />
                  <VoronoiNavbarLink
                    href="/profile"
                    className="hidden max-w-[16ch] self-stretch truncate sm:inline-flex"
                  >
                    {profile?.full_name || user.email}
                  </VoronoiNavbarLink>
                  <LogoutButton label={t.logout} pendingLabel={t.loggingOut} />
                </>
              ) : (
                <>
                  <VoronoiNavbarLink href="/login" className="self-stretch">
                    {t.login}
                  </VoronoiNavbarLink>
                  <ButtonLink href="/register">{t.register}</ButtonLink>
                </>
              )}
            </div>
          </div>

          {/* Primary nav collapses under the bar on small screens. */}
          <div className="flex gap-1 overflow-x-auto pb-1 md:hidden">
            <VoronoiNavbarLink href="/calendar" className="!py-2">
              {t.calendar}
            </VoronoiNavbarLink>
            <VoronoiNavbarLink href="/materials" className="!py-2">
              {t.materials}
            </VoronoiNavbarLink>
            <VoronoiNavbarLink href="/library" className="!py-2">
              {t.library}
            </VoronoiNavbarLink>
            <VoronoiNavbarLink href="/tools" className="!py-2">
              {t.tools}
            </VoronoiNavbarLink>
            {user && (
              <VoronoiNavbarLink href="/activities/new" className="!py-2">
                {t.proposeShort}
              </VoronoiNavbarLink>
            )}
            {user && (
              <VoronoiNavbarLink href="/profile" className="!py-2">
                {t.profile}
              </VoronoiNavbarLink>
            )}
            {isAdmin && (
              <VoronoiNavbarLink href="/admin" className="!py-2 text-brand">
                {t.adminShort}
              </VoronoiNavbarLink>
            )}
            <div className="ml-auto self-center">
              <LanguageToggle lang={lang} label={t.toggleLang} />
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
