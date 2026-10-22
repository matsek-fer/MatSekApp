import { cn } from "@/lib/utils";

const ASPECT = 1486 / 746; // intrinsic ratio of the source artwork

/**
 * Brand logo.
 *
 * The artwork is built from near-black linework — the dragon, the letter facets,
 * the "Matematička sekcija" line — over teal faces and gold accents, and it sinks
 * into the dark surface unaltered.
 *
 * A lightness-lifted second asset used to be swapped in for dark mode, and it
 * read pale: lifting everything compressed the mark into a narrow mid band and
 * took the gold with it — its darkest tone came out at 37% lightness against
 * the original's 19%, and the gold desaturated to a grey-green. The same file
 * is used in both themes now, with a light halo drawn behind it on dark so the
 * ink separates from the background while the brand colours stay exactly true.
 *
 * It renders as a CSS background rather than an <img> on purpose: one request,
 * and the halo filter applies to the painted artwork rather than a box.
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
        size === "sm" ? "bg-[url('/logo-sm.png')]" : "bg-[url('/logo.png')]",
        // Two shadows: a tight one to carve the outline away from the
        // background, a wider soft one so the edge does not read as a sticker.
        // Sized per asset because the blur radius is in pixels and does not
        // scale with however big the logo is drawn — at navbar size the wider
        // one is enough to smear the three-pixel-tall "Matematička sekcija"
        // line into a glow, so the small variant gets a much tighter pair.
        size === "sm"
          ? "dark:[filter:drop-shadow(0_0_0.5px_rgba(240,237,228,0.85))_drop-shadow(0_0_1.5px_rgba(240,237,228,0.3))]"
          : "dark:[filter:drop-shadow(0_0_1.5px_rgba(240,237,228,0.95))_drop-shadow(0_0_4px_rgba(240,237,228,0.42))]",
        className
      )}
      style={{ width, aspectRatio: String(ASPECT) }}
    />
  );
}
