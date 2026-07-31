import { cn } from "@/lib/utils";
import type { ActivityStatus } from "@/types";
import { ACTIVITY_STATUS_LABELS } from "@/types";

export type BadgeTone = "neutral" | "brand" | "success" | "warning" | "danger";

const TONES: Record<BadgeTone, string> = {
  neutral: "bg-surface-hover text-fg-muted",
  brand: "bg-brand/10 text-brand",
  success: "bg-success-bg text-success-fg",
  warning: "bg-warning-bg text-warning-fg",
  danger: "bg-danger-bg text-danger-fg",
};

export default function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-medium",
        TONES[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

const STATUS_TONES: Record<ActivityStatus, BadgeTone> = {
  pending: "warning",
  approved: "success",
  rejected: "danger",
};

/** Activity status pill — single source of truth for status colour + label. */
export function StatusBadge({
  status,
  className,
}: {
  status: ActivityStatus;
  className?: string;
}) {
  return (
    <Badge tone={STATUS_TONES[status]} className={className}>
      {ACTIVITY_STATUS_LABELS[status]}
    </Badge>
  );
}
