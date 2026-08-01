import { createClient as createServerClient } from "@/lib/supabase/server";
import type { Activity } from "@/types";
import Card from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import ActivityBrowser from "@/components/activities/ActivityBrowser";
import ActivityTimeline from "@/components/activities/ActivityTimeline";

export const dynamic = "force-dynamic";

const UPCOMING_LIMIT = 50;
/** A term or two of history is plenty to look back over. */
const PAST_LIMIT = 60;

export default async function CalendarPage() {
  const supabase = createServerClient();

  const now = new Date().toISOString();

  const [{ data: ahead }, { data: before }, { data: auth }] = await Promise.all([
    supabase
      .from("activities")
      .select("*, creator:profiles!created_by(id, email, full_name)")
      .eq("status", "approved")
      // The page leads with what is still ahead — a calendar headed by last
      // term's events is noise.
      .gte("end_time", now)
      .order("start_time", { ascending: true })
      .limit(UPCOMING_LIMIT),
    supabase
      .from("activities")
      .select("*, creator:profiles!created_by(id, email, full_name)")
      .eq("status", "approved")
      .lt("end_time", now)
      // Newest first *for the query*, so the limit keeps the most recent slice
      // of history rather than the oldest. It is reversed below for display.
      .order("start_time", { ascending: false })
      .limit(PAST_LIMIT),
    supabase.auth.getSession(),
  ]);

  const upcoming = (ahead ?? []) as Activity[];
  // Displayed oldest to newest, so the page reads as one timeline: history
  // runs down into the most recent past event, and the next event follows it.
  const past = [...((before ?? []) as Activity[])].reverse();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-fg">Kalendar aktivnosti</h1>
        {auth?.session && (
          <ButtonLink href="/activities/new">+ Predloži aktivnost</ButtonLink>
        )}
      </div>

      {upcoming.length === 0 && past.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-fg-muted">Još nema nadolazećih aktivnosti.</p>
          {auth?.session && (
            <ButtonLink href="/activities/new" variant="secondary" className="mt-4">
              Predloži prvu
            </ButtonLink>
          )}
        </Card>
      ) : (
        <>
          <ActivityBrowser upcoming={upcoming} past={past} />
          {/* Everything the page fetched, on one axis. */}
          <ActivityTimeline events={[...past, ...upcoming]} />
        </>
      )}
    </div>
  );
}
