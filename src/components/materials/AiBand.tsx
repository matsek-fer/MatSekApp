import { cn } from "@/lib/utils";
import { MATERIALS } from "@/lib/i18n/materials";
import type { Lang } from "@/lib/i18n";

/**
 * Translucent band behind sections that are still AI-drafted
 * (frontmatter `ai_generated`). Removed by dropping the flag, not by
 * editing the component.
 */
export default function AiBand({
  active,
  lang,
  children,
  className,
}: {
  active: boolean;
  lang: Lang;
  children: React.ReactNode;
  className?: string;
}) {
  if (!active) return <div className={className}>{children}</div>;
  const t = MATERIALS[lang];
  return (
    <div
      className={cn(
        "relative rounded-xl border border-warning/30 bg-warning-bg/40 px-5 py-4 pt-9 sm:pt-4 sm:pr-24",
        className
      )}
    >
      <span
        className="absolute right-3 top-3 rounded-full bg-warning-bg px-2 py-0.5
                   text-[11px] font-medium uppercase tracking-wide text-warning-fg"
        title={t.aiBandTitle}
      >
        {t.aiBand}
      </span>
      {children}
    </div>
  );
}
