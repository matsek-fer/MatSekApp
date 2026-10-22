import Card from "@/components/ui/Card";
import { cn } from "@/lib/utils";

/**
 * Instant loading state for every page under the dashboard navbar.
 *
 * A Link click is dispatched inside a React transition, and a transition only
 * commits once the new tree has something to show. Without this file there is
 * no Suspense boundary below the navbar, so the click sits on the old page
 * with the old URL until the destination's server render — every Supabase
 * round-trip in it — has finished. On a good connection that is a quarter of
 * a second; on a stalled one it is tens of seconds of what looks like a dead
 * link. With it, the URL changes and this skeleton paints on the click, and
 * the page streams in over it.
 *
 * It is a generic page shape (heading row, list card) rather than a copy of
 * any one page: the same boundary serves the calendar, documents, profile and
 * admin screens.
 */
export default function DashboardLoading() {
  return (
    <div
      role="status"
      aria-busy="true"
      className="space-y-6 motion-safe:animate-pulse"
    >
      <span className="sr-only">Učitavanje…</span>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Bone className="h-8 w-56" />
        <Bone className="h-10 w-40 rounded-lg" />
      </div>

      <Card className="divide-y divide-border">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="space-y-2 px-4 py-4">
            <Bone className="h-4 w-2/5" />
            <Bone className="h-3 w-1/4" />
          </div>
        ))}
      </Card>
    </div>
  );
}

function Bone({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("rounded bg-border", className)} />
  );
}
