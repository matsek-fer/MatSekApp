import { cn } from "@/lib/utils";
import { RESERVATION_STATUS_LABELS, type ReservationStatus } from "@/types";

const DOT: Record<ReservationStatus, string> = {
  not_sent: "bg-danger",
  pending: "bg-warning",
  confirmed: "bg-success",
};

/**
 * Whether the room is booked, beside the place it names: a traffic-light
 * dot and the words. The words are always shown — red against green is the
 * pair a colour-blind reader cannot tell apart, so the dot alone would say
 * nothing to them.
 */
export default function ReservationIndicator({
  status,
  className,
}: {
  status: ReservationStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs text-fg-muted",
        className
      )}
    >
      <span
        aria-hidden
        className={cn("h-2 w-2 shrink-0 rounded-full", DOT[status])}
      />
      {RESERVATION_STATUS_LABELS[status]}
    </span>
  );
}
