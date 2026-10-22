"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CATEGORY_ORDER, type TopicSummary } from "@/lib/materials-meta";
import { MATERIALS } from "@/lib/i18n/materials";
import type { Lang } from "@/lib/i18n";
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
  lang,
}: {
  topics: TopicSummary[];
  general: TopicSummary | null;
  titles: Record<string, string>;
  lang: Lang;
}) {
  const t = MATERIALS[lang];
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
            placeholder={t.searchPlaceholder}
            aria-label={t.searchLabel}
            className="field text-sm sm:max-w-xs"
          />
          <div className="flex items-center gap-1" role="group" aria-label={t.filterByDifficulty}>
            <span className="mr-1 text-xs text-fg-muted">{t.difficulty}</span>
            {[1, 2, 3, 4, 5].map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => toggleLevel(l)}
                title={t.difficultyLabels[l]}
                aria-pressed={levels.has(l)}
                className={cn(
                  "h-8 w-8 rounded-md border text-sm font-medium transition-colors",
                  levels.has(l)
                    ? "border-brand bg-brand text-brand-fg"
                    : "border-border-strong bg-surface text-fg hover:bg-surface-hover"
                )}
              >
                {l}
              </button>
            ))}
            {levels.size > 0 && (
              <button
                type="button"
                onClick={() => setLevels(new Set())}
                className="ml-1 text-xs text-fg-muted hover:text-fg"
              >
                {t.reset}
              </button>
            )}
          </div>
        </div>
        <div className="inline-flex rounded-lg border border-border-strong bg-surface p-0.5 self-start">
          {(["grid", "map"] as View[]).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setView(v)}
              aria-pressed={view === v}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm",
                view === v
                  ? "bg-brand text-brand-fg"
                  : "text-fg hover:bg-surface-hover"
              )}
            >
              {v === "grid" ? t.viewGrid : t.viewMap}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty legend */}
      <details className="text-sm text-fg-muted">
        <summary className="cursor-pointer select-none text-fg-muted hover:text-fg">
          {t.legendSummary}
        </summary>
        <ol className="mt-2 grid gap-1 sm:grid-cols-5">
          {[1, 2, 3, 4, 5].map((l) => (
            <li key={l} className="rounded-md bg-surface-hover px-3 py-2">
              <span className="font-semibold text-fg">{l}</span>{" "}
              <span>{t.difficultyLabels[l]}</span>
            </li>
          ))}
        </ol>
      </details>

      {/* General materials strip */}
      {general && (
        <Link
          href="/materials/general"
          className="flex flex-col gap-2 rounded-xl border border-brand/30 bg-brand/5 px-5 py-4
                     hover:bg-brand/10 transition-colors sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-brand">
              {t.categories.general.label}
            </div>
            <p className="text-sm text-fg">{general.tagline}</p>
          </div>
          <span className="text-sm text-brand whitespace-nowrap">
            {t.nSources(general.counts.materials)} →
          </span>
        </Link>
      )}

      {view === "map" ? (
        <PrereqMap topics={topics} titles={titles} matching={matching} lang={lang} />
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
                      className="text-lg font-semibold text-fg"
                    >
                      {t.categories[cat].label}
                    </h2>
                    <p className="text-sm text-fg-muted">
                      {t.categories[cat].description}
                    </p>
                  </div>
                  <span className="text-xs text-fg-subtle whitespace-nowrap">
                    {shown.length}/{inCat.length}
                  </span>
                </div>
                {shown.length === 0 ? (
                  <p className="text-sm text-fg-subtle italic">
                    {t.noMatch}
                  </p>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {shown.map((topic) => (
                      <TopicCard key={topic.id} topic={topic} titles={titles} lang={lang} />
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
