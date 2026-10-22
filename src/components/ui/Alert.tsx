import { cn } from "@/lib/utils";

export type AlertTone = "error" | "success" | "info";

const TONES: Record<AlertTone, string> = {
  error: "bg-danger-bg text-danger-fg border-danger/30",
  success: "bg-success-bg text-success-fg border-success/30",
  info: "bg-brand/10 text-brand border-brand/30",
};

/** Inline form feedback. Announced to screen readers when it appears. */
export default function Alert({
  tone = "error",
  className,
  children,
}: {
  tone?: AlertTone;
  className?: string;
  children: React.ReactNode;
}) {
  if (!children) return null;

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "rounded-lg border px-3 py-2.5 text-sm",
        TONES[tone],
        className
      )}
    >
      {children}
    </div>
  );
}
