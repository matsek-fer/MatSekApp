import { cn } from "@/lib/utils";
import type { Strength } from "@/lib/materials-meta";
import { MATERIALS } from "@/lib/i18n/materials";
import type { Lang } from "@/lib/i18n";

/** Three dots, filled up to the connection's strength; the words are in the tooltip. */
export default function StrengthDots({
  strength,
  lang,
  className,
}: {
  strength: Strength;
  lang: Lang;
  className?: string;
}) {
  const t = MATERIALS[lang];
  const label = `${t.strengthWord} ${strength}/3 — ${t.strengthLabels[strength]}`;
  return (
    <span
      className={cn("inline-flex items-center gap-0.5", className)}
      title={label}
      aria-label={label}
    >
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className={cn("h-1.5 w-1.5 rounded-full", i <= strength ? "bg-brand" : "bg-border")}
        />
      ))}
    </span>
  );
}
