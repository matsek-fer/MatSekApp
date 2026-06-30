import Link from "next/link";
import Image from "next/image";
import { createClient as createServerClient } from "@/lib/supabase/server";
import NotificationBell from "@/components/notifications/NotificationBell";
import VoronoiNavbarLink from "@/components/layout/VoronoiNavbarLink";

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
    const { data: p } = await supabase
      .from("profiles")
      .select("role, full_name")
      .eq("id", session.user.id)
      .single();
    profile = p;
  }

  const isAdmin = profile?.role === "admin";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-8">
              <Link
                href="/calendar"
                className="flex-shrink-0"
              >
                <Image
                  src="/logo.png"
                  alt="MATSEK — Matematička sekcija"
                  width={140}
                  height={48}
                  className="h-10 w-auto"
                  priority
                  unoptimized
                />
              </Link>
              <div className="hidden md:flex gap-1">
                <VoronoiNavbarLink href="/calendar">
                  Kalendar
                </VoronoiNavbarLink>
                {session && (
                  <VoronoiNavbarLink href="/activities/new">
                    Predloži aktivnost
                  </VoronoiNavbarLink>
                )}
                {isAdmin && (
                  <VoronoiNavbarLink
                    href="/admin"
                    className="text-brand-600 font-medium hover:text-brand-700"
                  >
                    Admin panel
                  </VoronoiNavbarLink>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              {session ? (
                <>
                  <NotificationBell />
                  <VoronoiNavbarLink href="/profile">
                    {profile?.full_name || session.user.email}
                  </VoronoiNavbarLink>
                </>
              ) : (
                <>
                  <VoronoiNavbarLink href="/login">
                    Prijavi se
                  </VoronoiNavbarLink>
                  <Link
                    href="/register"
                    className="px-4 py-2 bg-brand-600 text-white rounded-lg
                               hover:bg-brand-700 transition-colors text-sm"
                  >
                    Registriraj se
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Page content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
