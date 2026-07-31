import { cn } from "@/lib/utils";

const ASPECT = 1486 / 746; // intrinsic ratio of the source artwork

/**
 * Brand logo.
 *
 * The artwork has a transparent background and near-black elements (the dragon
 * and the "Matematička sekcija" line) that disappear on the dark surface, so
 * there is a lightness-lifted variant for dark mode.
 *
 * It renders as a CSS background rather than an <img> on purpose: the browser
 * only fetches the rule that actually matches, so a viewer downloads one
 * variant instead of both.
 */
export default function Logo({
  size = "sm",
  width,
  className,
}: {
  /** `sm` (480px asset) for navbar and forms, `lg` (1120px) for hero use. */
  size?: "sm" | "lg";
  /** Rendered width in px. Height follows the artwork's aspect ratio. */
  width: number;
  className?: string;
}) {
  return (
    <span
      role="img"
      aria-label="MATSEK — Matematička sekcija"
      className={cn(
        "block max-w-full bg-contain bg-center bg-no-repeat",
        size === "sm"
          ? "bg-[url('/logo-sm.png')] dark:bg-[url('/logo-sm-dark.png')]"
          : "bg-[url('/logo.png')] dark:bg-[url('/logo-dark.png')]",
        className
      )}
      style={{ width, aspectRatio: String(ASPECT) }}
    />
  );
}
