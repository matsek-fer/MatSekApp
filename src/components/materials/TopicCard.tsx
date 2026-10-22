import Link from "next/link";
import { difficultyRange, type TopicSummary } from "@/lib/materials-meta";
import { MATERIALS } from "@/lib/i18n/materials";
import type { Lang } from "@/lib/i18n";
import DifficultyBar from "./DifficultyBar";

/**
 * Compact overview card: title, tagline, difficulty span, counts and
 * prerequisite chips. Everything else lives on the topic page.
 */
export default function TopicCard({
  topic,
  titles,
  lang,
  dim = false,
}: {
  topic: TopicSummary;
  titles: Record<string, string>;
  lang: Lang;
  dim?: boolean;
}) {
  const t = MATERIALS[lang];
  return (
    <Link
      href={`/materials/${topic.id}`}
      className={`group flex h-full flex-col rounded-xl border border-border bg-surface p-4
                  transition-shadow hover:shadow-md ${dim ? "opacity-40" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-fg group-hover:text-brand leading-snug">
          {topic.title}
        </h3>
        {topic.aiGenerated.length > 0 && (
          <span
            className="shrink-0 rounded-full bg-warning-bg px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-warning-fg"
            title={t.aiBadgeTitle}
          >
            {t.aiBadge}
          </span>
        )}
      </div>
      <p className="mt-1.5 flex-1 text-sm text-fg-muted leading-relaxed">
        {topic.tagline}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-fg-muted">
        <DifficultyBar difficulty={topic.difficulty} lang={lang} />
        {topic.difficulty && (
          <span>
            {t.difficultyWord} {difficultyRange(topic.difficulty)}
          </span>
        )}
        <span>
          {t.nMaterials(topic.counts.materials)}
          {topic.counts.free > 0 && ` · ${t.nFree(topic.counts.free)}`}
        </span>
        {topic.counts.problems > 0 && (
          <span>{t.nProblems(topic.counts.problems)}</span>
        )}
      </div>
      {topic.prerequisites.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          <span className="text-[11px] text-fg-subtle mr-1 self-center">
            {t.prerequisites}
          </span>
          {topic.prerequisites.map((p) => (
            <span
              key={p}
              className="rounded bg-surface-hover px-1.5 py-0.5 text-[11px] text-fg-muted"
            >
              {titles[p] ?? p}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
