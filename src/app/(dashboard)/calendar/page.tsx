import Link from "next/link";
import { format, parseISO } from "date-fns";
import { hr } from "date-fns/locale";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { ACTIVITY_TYPE_LABELS } from "@/types";
import type { Activity } from "@/types";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

export default async function CalendarPage() {
  const supabase = createServerClient();

  const [{ data: activities }, { data: auth }] = await Promise.all([
    supabase
      .from("activities")
      .select("*, creator:profiles!created_by(id, email, full_name)")
      .eq("status", "approved")
      // Only what's still ahead — a calendar led by last term's events is noise.
      .gte("end_time", new Date().toISOString())
      .order("start_time", { ascending: true })
      .limit(PAGE_SIZE),
    supabase.auth.getSession(),
  ]);

  const upcoming = (activities ?? []) as Activity[];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-fg">Kalendar aktivnosti</h1>
        {auth?.session && (
          <ButtonLink href="/activities/new">+ Predloži aktivnost</ButtonLink>
        )}
      </div>

      {upcoming.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-fg-muted">Još nema nadolazećih aktivnosti.</p>
          {auth?.session && (
            <ButtonLink href="/activities/new" variant="secondary" className="mt-4">
              Predloži prvu
            </ButtonLink>
          )}
        </Card>
      ) : (
        <ul className="grid gap-3">
          {upcoming.map((activity) => (
            <li key={activity.id}>
              <Link
                href={`/activities/${activity.id}`}
                className="block rounded-xl border border-border bg-surface p-4
                           transition-colors hover:border-brand/40 hover:bg-surface-hover"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="font-semibold text-fg">{activity.title}</h2>
                    <p className="mt-1 text-sm text-fg-muted">
                      <time dateTime={activity.start_time}>
                        {format(
                          parseISO(activity.start_time),
                          "EEEE, dd.MM.yyyy. 'u' HH:mm",
                          { locale: hr }
                        )}
                      </time>
                      {" – "}
                      {format(parseISO(activity.end_time), "HH:mm")}
                    </p>
                    {activity.location && (
                      <p className="text-sm text-fg-subtle">
                        📍 {activity.location}
                      </p>
                    )}
                  </div>
                  <Badge tone="brand">
                    {ACTIVITY_TYPE_LABELS[activity.activity_type]}
                  </Badge>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
