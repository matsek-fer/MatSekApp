import { cn } from "@/lib/utils";
import { DIFFICULTY_LABELS, type Difficulty } from "@/lib/materials-meta";

/**
 * Five segments, filled from `min` to `max`. Reads as "which levels does
 * this cover" at a glance; the full labels are in the title tooltip.
 */
export default function DifficultyBar({
  difficulty,
  size = "sm",
  className,
}: {
  difficulty: Difficulty | null;
  size?: "sm" | "md";
  className?: string;
}) {
  const title = difficulty
    ? difficulty.min === difficulty.max
      ? `Težina ${difficulty.min} — ${DIFFICULTY_LABELS[difficulty.min]}`
      : `Težina ${difficulty.min}–${difficulty.max} — od „${
          DIFFICULTY_LABELS[difficulty.min]
        }” do „${DIFFICULTY_LABELS[difficulty.max]}”`
    : "Težina nije označena";
  const seg = size === "sm" ? "h-1.5 w-3" : "h-2 w-4";
  return (
    <span
      className={cn("inline-flex items-center gap-0.5", className)}
      title={title}
      aria-label={title}
    >
      {[1, 2, 3, 4, 5].map((l) => {
        const on = difficulty && l >= difficulty.min && l <= difficulty.max;
        return (
          <span
            key={l}
            className={cn(
              "rounded-sm",
              seg,
              on ? "bg-brand" : "bg-border"
            )}
          />
        );
      })}
    </span>
  );
}
