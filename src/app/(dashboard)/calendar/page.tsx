import { withUser } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/session";
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
  const user = await getCurrentUser();

  // Anonymous visitors may read only `id` and `full_name` from profiles (a
  // column-level grant in db/schema.sql), which is all the
  // activities_with_creator view names — so the same query serves everyone.
  const [ahead, before] = await withUser(user?.id ?? null, (tx) =>
    // Both halves split on the transaction's one now(), so an event ending
    // this instant lands in exactly one of them.
    Promise.all([
      // The page leads with what is still ahead — a calendar headed by last
      // term's events is noise.
      tx<Activity[]>`
        SELECT * FROM activities_with_creator
        WHERE status = 'approved' AND end_time >= now()
        ORDER BY start_time ASC
        LIMIT ${UPCOMING_LIMIT}
      `,
      // Newest first *for the query*, so the limit keeps the most recent slice
      // of history rather than the oldest. It is reversed below for display.
      tx<Activity[]>`
        SELECT * FROM activities_with_creator
        WHERE status = 'approved' AND end_time < now()
        ORDER BY start_time DESC
        LIMIT ${PAST_LIMIT}
      `,
    ])
  );

  const upcoming: Activity[] = [...ahead];
  // Displayed oldest to newest, so the page reads as one timeline: history
  // runs down into the most recent past event, and the next event follows it.
  const past: Activity[] = [...before].reverse();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-fg">Kalendar aktivnosti</h1>
        {user && (
          <ButtonLink href="/activities/new">+ Predloži aktivnost</ButtonLink>
        )}
      </div>

      {upcoming.length === 0 && past.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-fg-muted">Još nema nadolazećih aktivnosti.</p>
          {user && (
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
