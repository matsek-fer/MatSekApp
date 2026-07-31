"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { generateTree, randomSeed, renderTree } from "@/lib/ascii-tree";

/** How long a tree takes to draw itself, and how long it stands once grown. */
const GROW_MS = 2600;
const HOLD_MS = 2400;
/** ~30fps: fast enough to read as growth, cheap enough not to thrash React. */
const FRAME_MS = 33;

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
  const lines = useMemo(
    () => renderTree(tree, growth >= 1 ? Infinity : tree.duration * growth),
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

  // The grid is a fixed number of characters; the glyphs scale with the
  // viewport so the tree fills a wide screen without overflowing a narrow one.
  const artStyle = {
    fontSize: "clamp(5px, 1.7vw, 18px)",
    lineHeight: 1.08,
  } as const;

  return (
    <section
      aria-label="Generator ASCII stabala"
      className="flex w-full flex-1 flex-col items-center justify-center gap-4 py-6"
    >
      <div className="flex min-h-[52vh] w-full items-center justify-center overflow-x-auto px-2">
        <pre
          aria-label={`ASCII stablo, seed ${seed}`}
          style={artStyle}
          className="select-none whitespace-pre text-center font-mono
                     text-emerald-700 dark:text-emerald-400"
        >
          {lines.join("\n")}
        </pre>

        {/* Growth needs JavaScript; without it, show the finished tree. */}
        <noscript>
          <pre
            style={artStyle}
            className="select-none whitespace-pre text-center font-mono
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
