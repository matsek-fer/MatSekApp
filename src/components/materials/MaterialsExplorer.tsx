"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CATEGORY_META,
  CATEGORY_ORDER,
  DIFFICULTY_LABELS,
  type TopicSummary,
} from "@/lib/materials-meta";
import TopicCard from "./TopicCard";
import PrereqMap from "./PrereqMap";
import { cn } from "@/lib/utils";

type View = "grid" | "map";

/**
 * The overview: search + difficulty filter, then either the category grid
 * or the prerequisite map. Filters narrow both views the same way.
 */
export default function MaterialsExplorer({
  topics,
  general,
  titles,
}: {
  topics: TopicSummary[];
  general: TopicSummary | null;
  titles: Record<string, string>;
}) {
  const [query, setQuery] = useState("");
  const [levels, setLevels] = useState<Set<number>>(new Set());
  const [view, setView] = useState<View>("grid");

  const matching = useMemo(() => {
    const q = query.trim().toLowerCase();
    const ids = topics
      .filter((t) => {
        if (levels.size && !t.levels.some((l) => levels.has(l))) return false;
        if (!q) return true;
        return (
          t.title.toLowerCase().includes(q) ||
          t.tagline.toLowerCase().includes(q) ||
          t.id.includes(q)
        );
      })
      .map((t) => t.id);
    return new Set(ids);
  }, [topics, query, levels]);

  const toggleLevel = (l: number) =>
    setLevels((s) => {
      const n = new Set(s);
      n.has(l) ? n.delete(l) : n.add(l);
      return n;
    });

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pretraži teme…"
            aria-label="Pretraži teme"
            className="w-full sm:max-w-xs rounded-lg border border-gray-300 px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <div className="flex items-center gap-1" role="group" aria-label="Filtriraj po težini">
            <span className="mr-1 text-xs text-gray-500">Težina</span>
            {[1, 2, 3, 4, 5].map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => toggleLevel(l)}
                title={DIFFICULTY_LABELS[l]}
                aria-pressed={levels.has(l)}
                className={cn(
                  "h-8 w-8 rounded-md border text-sm font-medium transition-colors",
                  levels.has(l)
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                )}
              >
                {l}
              </button>
            ))}
            {levels.size > 0 && (
              <button
                type="button"
                onClick={() => setLevels(new Set())}
                className="ml-1 text-xs text-gray-500 hover:text-gray-800"
              >
                poništi
              </button>
            )}
          </div>
        </div>
        <div className="inline-flex rounded-lg border border-gray-300 bg-white p-0.5 self-start">
          {(["grid", "map"] as View[]).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              aria-pressed={view === v}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm",
                view === v
                  ? "bg-brand-600 text-white"
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              {v === "grid" ? "Pregled" : "Karta preduvjeta"}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty legend */}
      <details className="text-sm text-gray-600">
        <summary className="cursor-pointer select-none text-gray-500 hover:text-gray-800">
          Što znače razine težine?
        </summary>
        <ol className="mt-2 grid gap-1 sm:grid-cols-5">
          {[1, 2, 3, 4, 5].map((l) => (
            <li key={l} className="rounded-md bg-gray-50 px-3 py-2">
              <span className="font-semibold text-gray-900">{l}</span>{" "}
              <span>{DIFFICULTY_LABELS[l]}</span>
            </li>
          ))}
        </ol>
      </details>

      {/* General materials strip */}
      {general && (
        <Link
          href="/materials/general"
          className="flex flex-col gap-2 rounded-xl border border-brand-200 bg-brand-50/60 px-5 py-4
                     hover:bg-brand-50 transition-colors sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-brand-700">
              {CATEGORY_META.general.label}
            </div>
            <p className="text-sm text-gray-700">{general.tagline}</p>
          </div>
          <span className="text-sm text-brand-700 whitespace-nowrap">
            {general.counts.materials} izvora →
          </span>
        </Link>
      )}

      {view === "map" ? (
        <PrereqMap topics={topics} titles={titles} matching={matching} />
      ) : (
        <div className="space-y-10">
          {CATEGORY_ORDER.map((cat) => {
            const inCat = topics.filter((t) => t.category === cat);
            const shown = inCat.filter((t) => matching.has(t.id));
            if (inCat.length === 0) return null;
            return (
              <section key={cat} aria-labelledby={`cat-${cat}`}>
                <div className="mb-3 flex items-baseline justify-between gap-4">
                  <div>
                    <h2
                      id={`cat-${cat}`}
                      className="text-lg font-semibold text-gray-900"
                    >
                      {CATEGORY_META[cat].label}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {CATEGORY_META[cat].description}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {shown.length}/{inCat.length}
                  </span>
                </div>
                {shown.length === 0 ? (
                  <p className="text-sm text-gray-400 italic">
                    Nijedna tema ne odgovara filtru.
                  </p>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {shown.map((t) => (
                      <TopicCard key={t.id} topic={t} titles={titles} />
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
