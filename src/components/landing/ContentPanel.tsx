"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { generateTree, randomSeed } from "@/lib/ascii-tree";

const REGENERATE_MS = 5000;

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

  const tree = useMemo(() => generateTree(seed), [seed]);

  const regenerate = useCallback(() => setSeed(randomSeed()), []);

  // One timeout per tree. The countdown bar is a CSS animation keyed to the
  // seed, so nothing re-renders between trees.
  useEffect(() => {
    if (paused) return;
    const id = setTimeout(regenerate, REGENERATE_MS);
    return () => clearTimeout(id);
  }, [seed, paused, regenerate]);

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
          <span className="text-fg-muted">{tree.species}</span>
        </p>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={regenerate}
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

      {/* Countdown to the next tree. `key` restarts the animation each seed. */}
      <div className="h-0.5 w-full bg-border" aria-hidden="true">
        <div
          key={seed}
          className="h-full w-0 animate-countdown bg-brand/60"
          style={{ animationPlayState: paused ? "paused" : "running" }}
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
          {tree.lines.join("\n")}
        </pre>
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
