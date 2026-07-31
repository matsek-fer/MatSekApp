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
      const next = Math.min(
        1,
        from + (performance.now() - startedAt) / GROW_MS
      );
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

  return (
    <section
      aria-label="Generator ASCII stabala"
      className="mx-4 mb-8 flex w-full max-w-3xl flex-col overflow-hidden
                 rounded-xl border border-border bg-surface shadow-sm"
    >
      {/* Terminal title bar */}
      <div className="flex items-center gap-2 border-b border-border bg-surface-hover px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-danger/70" />
        <span className="h-3 w-3 rounded-full bg-warning/70" />
        <span className="h-3 w-3 rounded-full bg-success/70" />
        <span className="ml-2 font-mono text-xs text-fg-subtle">
          matsek — ascii-tree
        </span>
      </div>

      {/* Seed + controls */}
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5">
        <p className="min-w-0 font-mono text-xs text-fg-muted sm:text-sm">
          <span className="text-fg-subtle">seed</span>{" "}
          <span className="select-all font-medium text-fg">{seed}</span>
          <span className="mx-2 text-fg-subtle">·</span>
          <span>{tree.species}</span>
        </p>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => plant(randomSeed())}
            className="rounded-lg p-1.5 text-fg-muted transition-colors
                       hover:bg-surface-hover hover:text-fg"
            aria-label="Generiraj novo stablo"
            title="Generiraj novo stablo"
          >
            <RefreshIcon />
          </button>
          <button
            type="button"
            onClick={() => setPaused((v) => !v)}
            className="rounded-lg p-1.5 text-fg-muted transition-colors
                       hover:bg-surface-hover hover:text-fg"
            aria-label={paused ? "Nastavi" : "Pauziraj"}
            aria-pressed={paused}
            title={paused ? "Nastavi" : "Pauziraj"}
          >
            {paused ? <PlayIcon /> : <PauseIcon />}
          </button>
        </div>
      </div>

      {/* Growth progress */}
      <div className="h-0.5 w-full bg-border" aria-hidden="true">
        <div
          className="h-full bg-brand/60"
          style={{
            width: `${growth * 100}%`,
            transition: growth === 0 ? "none" : `width ${FRAME_MS}ms linear`,
          }}
        />
      </div>

      {/* The tree */}
      <div className="flex min-h-[20rem] flex-1 items-center justify-center overflow-x-auto p-4 sm:min-h-[24rem]">
        <pre
          aria-label={`ASCII stablo, vrsta ${tree.species}, seed ${seed}`}
          className="select-none whitespace-pre text-center font-mono
                     text-[9px] leading-[1.15] text-emerald-600
                     dark:text-emerald-400 sm:text-xs sm:leading-tight"
        >
          {lines.join("\n")}
        </pre>

        {/* Growth needs JavaScript; without it, show the finished tree. */}
        <noscript>
          <pre
            className="select-none whitespace-pre text-center font-mono
                       text-[9px] leading-[1.15] text-emerald-600
                       dark:text-emerald-400 sm:text-xs sm:leading-tight"
          >
            {renderTree(tree).join("\n")}
          </pre>
        </noscript>
      </div>
    </section>
  );
}

const ICON = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 18,
  height: 18,
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
