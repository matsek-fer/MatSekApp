import Link from "next/link";
import { createClient as createServerClient } from "@/lib/supabase/server";
import NotificationBell from "@/components/notifications/NotificationBell";
import VoronoiNavbarLink from "@/components/layout/VoronoiNavbarLink";
import LogoutButton from "@/components/auth/LogoutButton";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { ButtonLink } from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  let profile: { role: string; full_name: string } | null = null;

  if (session) {
    const { data } = await supabase
      .from("profiles")
      .select("role, full_name")
      .eq("id", session.user.id)
      .single();
    profile = data;
  }

  const isAdmin = profile?.role === "admin";

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
                aria-label="Početna stranica"
              >
                <Logo width={112} />
              </Link>

              <div className="hidden gap-1 self-stretch md:flex">
                <VoronoiNavbarLink href="/calendar">Kalendar</VoronoiNavbarLink>
                {session && (
                  <VoronoiNavbarLink href="/activities/new">
                    Predloži aktivnost
                  </VoronoiNavbarLink>
                )}
                {session && (
                  <VoronoiNavbarLink href="/documents">
                    Dokumenti
                  </VoronoiNavbarLink>
                )}
                {isAdmin && (
                  <VoronoiNavbarLink href="/admin" className="text-brand">
                    Admin panel
                  </VoronoiNavbarLink>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 self-stretch sm:gap-2">
              <ThemeToggle />
              {session ? (
                <>
                  <NotificationBell />
                  <VoronoiNavbarLink
                    href="/profile"
                    className="hidden max-w-[16ch] self-stretch truncate sm:inline-flex"
                  >
                    {profile?.full_name || session.user.email}
                  </VoronoiNavbarLink>
                  <LogoutButton />
                </>
              ) : (
                <>
                  <VoronoiNavbarLink href="/login" className="self-stretch">
                    Prijavi se
                  </VoronoiNavbarLink>
                  <ButtonLink href="/register">Registriraj se</ButtonLink>
                </>
              )}
            </div>
          </div>

          {/* Primary nav collapses under the bar on small screens. */}
          <div className="flex gap-1 overflow-x-auto pb-1 md:hidden">
            <VoronoiNavbarLink href="/calendar" className="!py-2">
              Kalendar
            </VoronoiNavbarLink>
            {session && (
              <VoronoiNavbarLink href="/activities/new" className="!py-2">
                Predloži
              </VoronoiNavbarLink>
            )}
            {session && (
              <VoronoiNavbarLink href="/documents" className="!py-2">
                Dokumenti
              </VoronoiNavbarLink>
            )}
            {session && (
              <VoronoiNavbarLink href="/profile" className="!py-2">
                Profil
              </VoronoiNavbarLink>
            )}
            {isAdmin && (
              <VoronoiNavbarLink href="/admin" className="!py-2 text-brand">
                Admin
              </VoronoiNavbarLink>
            )}
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
