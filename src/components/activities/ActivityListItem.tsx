import Link from "next/link";
import { format, parseISO } from "date-fns";
import { hr } from "date-fns/locale";
import { ACTIVITY_TYPE_LABELS } from "@/types";
import type { Activity } from "@/types";
import Badge from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

/**
 * One row of the activity list.
 *
 * Lifted out of the calendar page so the past, upcoming and expanded lists are
 * the same thing rather than three copies that drift apart.
 */
export default function ActivityListItem({
  activity,
  past = false,
}: {
  activity: Activity;
  /** Dims the row — an event that has already happened is reference, not plan. */
  past?: boolean;
}) {
  return (
    <li>
      <Link
        href={`/activities/${activity.id}`}
        className={cn(
          "block rounded-xl border border-border bg-surface p-4",
          "transition-colors hover:border-brand/40 hover:bg-surface-hover",
          past && "opacity-70 hover:opacity-100"
        )}
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
              <p className="text-sm text-fg-subtle">📍 {activity.location}</p>
            )}
          </div>
          <Badge tone={past ? "neutral" : "brand"}>
            {ACTIVITY_TYPE_LABELS[activity.activity_type]}
          </Badge>
        </div>
      </Link>
    </li>
  );
}
