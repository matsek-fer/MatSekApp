"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { generateTree, randomSeed, renderTree } from "@/lib/ascii-tree";

/** How long a tree takes to draw itself, and how long it stands once grown. */
const GROW_MS = 2600;
const HOLD_MS = 2400;
/** ~30fps: fast enough to read as growth, cheap enough not to thrash React. */
const FRAME_MS = 33;

/** Tight enough that the canopy reads as foliage rather than stacked rows. */
const LINE_HEIGHT = 1.05;
/** Share of the viewport the art claims until the band has been measured. */
const WIDTH_BUDGET_VW = 94;
const HEIGHT_BUDGET_VH = 58;
/** Advance width of a monospace glyph, in em. */
const GLYPH_ADVANCE = 0.62;

export default function ContentPanel({
  /**
   * Chosen on the server so the first render matches hydration. After that the
   * client picks its own seeds.
   */
  initialSeed,
}: {
  initialSeed: number;
}) {
  const [seed, setSeed] = useState(initialSeed);
  const [paused, setPaused] = useState(false);

  // 0 = bare ground, 1 = fully grown. Starts empty so the server markup and
  // the first client frame agree, and the tree grows in rather than appearing
  // whole and then restarting.
  const [growth, setGrowth] = useState(0);
  const growthRef = useRef(0);

  const tree = useMemo(() => generateTree(seed), [seed]);
  // Padded to the finished tree's full width: renderTree trims each row, and a
  // block whose width changes every frame would drift sideways under the
  // centring flex as the tree grows.
  const lines = useMemo(
    () =>
      renderTree(tree, growth >= 1 ? Infinity : tree.duration * growth).map(
        (line) => line.padEnd(tree.width)
      ),
    [tree, growth]
  );

  const advance = useCallback((value: number) => {
    growthRef.current = value;
    setGrowth(value);
  }, []);

  const plant = useCallback(
    (nextSeed: number) => {
      setSeed(nextSeed);
      advance(0);
    },
    [advance]
  );

  const reducedMotion = useRef(false);
  useEffect(() => {
    reducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reducedMotion.current) advance(1);
  }, [advance]);

  // Draw the tree from the ground up.
  useEffect(() => {
    if (paused || growthRef.current >= 1) return;
    if (reducedMotion.current) {
      advance(1);
      return;
    }

    const startedAt = performance.now();
    const from = growthRef.current;

    const id = setInterval(() => {
      const next = Math.min(1, from + (performance.now() - startedAt) / GROW_MS);
      advance(next);
      if (next >= 1) clearInterval(id);
    }, FRAME_MS);

    return () => clearInterval(id);
  }, [seed, paused, advance]);

  // Let the finished tree stand for a beat, then plant the next one.
  const grown = growth >= 1;
  useEffect(() => {
    if (paused || !grown) return;
    // With motion reduced there is no growth phase, so the tree holds for the
    // whole cycle instead of cutting it short.
    const hold = reducedMotion.current ? GROW_MS + HOLD_MS : HOLD_MS;
    const id = setTimeout(() => plant(randomSeed()), hold);
    return () => clearTimeout(id);
  }, [seed, grown, paused, plant]);

  // The grid is a fixed number of characters, so the glyph size — not the
  // layout — decides how big the tree looks. Measure the band and scale this
  // tree to fill it: whichever runs out first, width or height, sets the size.
  // Species differ in shape (a willow is wide, a birch tall), so each one is
  // sized on its own rather than sharing one compromise scale.
  const band = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);
  useEffect(() => {
    const el = band.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setBox({ w: width, h: height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const artStyle = useMemo(() => {
    // Until the band has been measured — server render, and the first client
    // render, which must match it — fall back to viewport units.
    // A hair under the full width: monospace advance varies by a percent or
    // two between fonts, and a wide species should not graze the edges.
    const w = box ? `${box.w * 0.96}px` : `${WIDTH_BUDGET_VW}vw`;
    const h = box ? `${box.h}px` : `${HEIGHT_BUDGET_VH}vh`;
    return {
      fontSize: `max(5px, min(
        calc(${w} / ${(tree.width * GLYPH_ADVANCE).toFixed(2)}),
        calc(${h} / ${(tree.height * LINE_HEIGHT).toFixed(2)})
      ))`,
      lineHeight: LINE_HEIGHT,
    } as const;
  }, [box, tree.width, tree.height]);

  // Padded more at the top than the bottom, so the tree sits lower in the space
  // it is given rather than centred in it.
  return (
    <section
      aria-label="Generator ASCII stabala"
      className="flex w-full flex-1 flex-col items-center justify-center gap-2 pb-2 pt-10"
    >
      {/* Edge to edge: no frame, no max width. The band takes exactly whatever
          height the viewport has left below the header and never asks for
          more, so the page fits on one screen and the tree is sized down to
          suit rather than running off the bottom. basis-0 and min-h-0 keep
          that a one-way street: the art is sized to the band, never the band
          to the art, which would otherwise feed back into the measurement. */}
      <div
        ref={band}
        className="flex w-full min-h-0 flex-1 basis-0 items-center
                   justify-center overflow-hidden"
      >
        {/* Left-aligned on purpose: centring would centre each row separately
            and shear the art. The block as a whole is centred by the flex. */}
        <pre
          aria-label={`ASCII stablo, seed ${seed}`}
          style={artStyle}
          className="select-none whitespace-pre text-left font-mono
                     text-emerald-700 dark:text-emerald-400"
        >
          {lines.join("\n")}
        </pre>

        {/* Growth needs JavaScript; without it, show the finished tree. */}
        <noscript>
          <pre
            style={artStyle}
            className="select-none whitespace-pre text-left font-mono
                       text-emerald-700 dark:text-emerald-400"
          >
            {renderTree(tree).join("\n")}
          </pre>
        </noscript>
      </div>

      <div className="flex items-center gap-2 font-mono text-xs text-fg-subtle">
        <span>
          seed <span className="select-all text-fg-muted">{seed}</span>
        </span>

        <button
          type="button"
          onClick={() => plant(randomSeed())}
          className="rounded-lg p-1.5 transition-colors hover:bg-surface-hover hover:text-fg"
          aria-label="Generiraj novo stablo"
          title="Generiraj novo stablo"
        >
          <RefreshIcon />
        </button>
        <button
          type="button"
          onClick={() => setPaused((v) => !v)}
          className="rounded-lg p-1.5 transition-colors hover:bg-surface-hover hover:text-fg"
          aria-label={paused ? "Nastavi" : "Pauziraj"}
          aria-pressed={paused}
          title={paused ? "Nastavi" : "Pauziraj"}
        >
          {paused ? <PlayIcon /> : <PauseIcon />}
        </button>
      </div>
    </section>
  );
}

const ICON = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  "aria-hidden": true,
} as const;

function PauseIcon() {
  return (
    <svg {...ICON} fill="currentColor">
      <rect x="6" y="4" width="4" height="16" rx="1" />
      <rect x="14" y="4" width="4" height="16" rx="1" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg {...ICON} fill="currentColor">
      <polygon points="6,4 20,12 6,20" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg
      {...ICON}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-3-6.7" />
      <polyline points="21 3 21 9 15 9" />
    </svg>
  );
}
