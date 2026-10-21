import { cn } from "@/lib/utils";

/**
 * Translucent band behind sections that are still AI-drafted
 * (frontmatter `ai_generated`). Removed by dropping the flag, not by
 * editing the component.
 */
export default function AiBand({
  active,
  children,
  className,
}: {
  active: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  if (!active) return <div className={className}>{children}</div>;
  return (
    <div
      className={cn(
        "relative rounded-xl border border-amber-200/70 bg-amber-50/50 px-5 py-4 pt-9 sm:pt-4 sm:pr-24",
        className
      )}
    >
      <span
        className="absolute right-3 top-3 rounded-full bg-amber-100 px-2 py-0.5
                   text-[11px] font-medium uppercase tracking-wide text-amber-800"
        title="Ovaj odjeljak je generiran uz pomoć AI-ja i još ga nije pregledao član sekcije."
      >
        AI nacrt
      </span>
      {children}
    </div>
  );
}
