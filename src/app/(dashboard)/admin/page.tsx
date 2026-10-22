import Link from "next/link";
import { redirect } from "next/navigation";
import { format, parseISO } from "date-fns";
import { hr } from "date-fns/locale";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { ACTIVITY_TYPE_LABELS } from "@/types";
import type { Activity } from "@/types";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (profile?.role !== "admin") redirect("/calendar");

  const { data } = await supabase
    .from("activities")
    .select("*, creator:profiles!created_by(id, email, full_name)")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  const pending = (data ?? []) as Activity[];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-fg">Admin panel</h1>

      <Card>
        <CardHeader>
          <CardTitle>Aktivnosti na čekanju ({pending.length})</CardTitle>
        </CardHeader>

        {pending.length === 0 ? (
          <p className="p-6 text-center text-fg-muted">
            Nema aktivnosti na čekanju.
          </p>
        ) : (
          <ul>
            {pending.map((a) => (
              <li
                key={a.id}
                className="flex flex-wrap items-start justify-between gap-4
                           border-b border-border p-4 last:border-b-0"
              >
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/activities/${a.id}`}
                    className="font-medium text-fg hover:text-brand"
                  >
                    {a.title}
                  </Link>
                  <p className="mt-0.5 text-sm text-fg-muted">
                    {ACTIVITY_TYPE_LABELS[a.activity_type]} ·{" "}
                    {format(parseISO(a.start_time), "dd.MM.yyyy. HH:mm", {
                      locale: hr,
                    })}
                    {a.location && ` · ${a.location}`}
                  </p>
                  <p className="text-xs text-fg-subtle">
                    Predložio/la: {a.creator?.full_name || a.creator?.email}
                  </p>
                </div>
                <ButtonLink href={`/admin/review/${a.id}`} size="sm">
                  Pregledaj
                </ButtonLink>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
