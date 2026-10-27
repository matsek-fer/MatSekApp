"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CATEGORY_META,
  CATEGORY_ORDER,
  type TopicSummary,
} from "@/lib/materials-meta";
import TopicCard from "./TopicCard";
import PrereqMap from "./PrereqMap";
import { cn } from "@/lib/utils";

type View = "grid" | "map";

/**
 * The overview: a search box, then either the topics listed by category or
 * the prerequisite map. Nothing else — the page is a list of names to open
 * one at a time, and everything about a topic lives on its own page.
 */
export default function MaterialsExplorer({
  topics,
  hasGeneral,
  titles,
}: {
  topics: TopicSummary[];
  hasGeneral: boolean;
  titles: Record<string, string>;
}) {
  const [query, setQuery] = useState("");
  const [view, setView] = useState<View>("grid");

  const matching = useMemo(() => {
    const q = query.trim().toLowerCase();
    const ids = topics
      .filter(
        (t) =>
          !q ||
          t.title.toLowerCase().includes(q) ||
          t.shortTitle.toLowerCase().includes(q) ||
          t.id.includes(q)
      )
      .map((t) => t.id);
    return new Set(ids);
  }, [topics, query]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pretraži teme…"
          aria-label="Pretraži teme"
          className="field text-sm sm:max-w-xs"
        />
        <div className="inline-flex self-start rounded-lg border border-border-strong bg-surface p-0.5">
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
              {v === "grid" ? "Popis" : "Karta preduvjeta"}
            </button>
          ))}
        </div>
      </div>

      {hasGeneral && (
        <Link
          href="/materials/general"
          className="flex items-center justify-between gap-4 rounded-xl border border-brand/30 bg-brand/5 px-5 py-4
                     transition-colors hover:bg-brand/10"
        >
          <span className="font-medium text-fg">{CATEGORY_META.general.label}</span>
          <span className="whitespace-nowrap text-sm text-brand">→</span>
        </Link>
      )}

      {view === "map" ? (
        <PrereqMap topics={topics} titles={titles} matching={matching} />
      ) : (
        <div className="space-y-8">
          {CATEGORY_ORDER.map((cat) => {
            const inCat = topics.filter((t) => t.category === cat);
            const shown = inCat.filter((t) => matching.has(t.id));
            if (inCat.length === 0) return null;
            return (
              <section key={cat} aria-labelledby={`cat-${cat}`}>
                <h2
                  id={`cat-${cat}`}
                  className="mb-3 text-lg font-semibold text-fg"
                >
                  {CATEGORY_META[cat].label}
                </h2>
                {shown.length === 0 ? (
                  <p className="text-sm italic text-fg-subtle">
                    Nijedna tema ne odgovara pretrazi.
                  </p>
                ) : (
                  <ul className="divide-y divide-border rounded-xl border border-border bg-surface">
                    {shown.map((t) => (
                      <TopicCard key={t.id} topic={t} titles={titles} />
                    ))}
                  </ul>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
