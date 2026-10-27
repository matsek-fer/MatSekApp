"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CATEGORY_ORDER,
  VIEWS,
  type ConnectionSummary,
  type TopicSummary,
  type View,
} from "@/lib/materials-meta";
import { MATERIALS } from "@/lib/i18n/materials";
import type { Lang } from "@/lib/i18n";
import TopicCard from "./TopicCard";
import PrereqMap from "./PrereqMap";
import ConnectionsMap from "./ConnectionsMap";
import { cn } from "@/lib/utils";

/**
 * The overview: a search box, then the topics listed by category, the
 * prerequisite map or the connections map. Nothing else — the page is a
 * list of names to open one at a time, and everything about a topic lives
 * on its own page. The search narrows all three views the same way.
 */
export default function MaterialsExplorer({
  topics,
  hasGeneral,
  titles,
  connections,
  lang,
  initialView = "grid",
}: {
  topics: TopicSummary[];
  hasGeneral: boolean;
  titles: Record<string, string>;
  connections: ConnectionSummary[];
  lang: Lang;
  /** From `?view=`, so a link can open the page on a map. */
  initialView?: View;
}) {
  const t = MATERIALS[lang];
  const viewLabel: Record<View, string> = {
    grid: t.viewGrid,
    map: t.viewMap,
    connections: t.viewConnections,
  };
  const [query, setQuery] = useState("");
  const [view, setView] = useState<View>(initialView);

  const matching = useMemo(() => {
    const q = query.trim().toLowerCase();
    const ids = topics
      .filter(
        (topic) =>
          !q ||
          topic.title.toLowerCase().includes(q) ||
          topic.shortTitle.toLowerCase().includes(q) ||
          topic.id.includes(q)
      )
      .map((topic) => topic.id);
    return new Set(ids);
  }, [topics, query]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
          aria-label={t.searchLabel}
          className="field text-sm sm:max-w-xs"
        />
        <div className="inline-flex self-start rounded-lg border border-border-strong bg-surface p-0.5">
          {VIEWS.map((v) => (
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
              {viewLabel[v]}
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
          <span className="font-medium text-fg">{t.categories.general.label}</span>
          <span className="whitespace-nowrap text-sm text-brand">→</span>
        </Link>
      )}

      {view === "map" ? (
        <PrereqMap topics={topics} titles={titles} matching={matching} lang={lang} />
      ) : view === "connections" ? (
        <ConnectionsMap
          topics={topics}
          titles={titles}
          connections={connections}
          matching={matching}
          lang={lang}
        />
      ) : (
        <div className="space-y-8">
          {CATEGORY_ORDER.map((cat) => {
            const inCat = topics.filter((topic) => topic.category === cat);
            const shown = inCat.filter((topic) => matching.has(topic.id));
            if (inCat.length === 0) return null;
            return (
              <section key={cat} aria-labelledby={`cat-${cat}`}>
                <h2 id={`cat-${cat}`} className="mb-3 text-lg font-semibold text-fg">
                  {t.categories[cat].label}
                </h2>
                {shown.length === 0 ? (
                  <p className="text-sm italic text-fg-subtle">{t.noMatch}</p>
                ) : (
                  <ul className="divide-y divide-border rounded-xl border border-border bg-surface">
                    {shown.map((topic) => (
                      <TopicCard key={topic.id} topic={topic} titles={titles} lang={lang} />
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
