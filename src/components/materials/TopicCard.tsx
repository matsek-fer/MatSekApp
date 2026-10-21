import Link from "next/link";
import type { TopicSummary } from "@/lib/materials-meta";
import DifficultyBar from "./DifficultyBar";

/**
 * Compact overview card: title, tagline, difficulty span, counts and
 * prerequisite chips. Everything else lives on the topic page.
 */
export default function TopicCard({
  topic,
  titles,
  dim = false,
}: {
  topic: TopicSummary;
  titles: Record<string, string>;
  dim?: boolean;
}) {
  return (
    <Link
      href={`/materials/${topic.id}`}
      className={`group flex h-full flex-col rounded-xl border border-gray-200 bg-white p-4
                  transition-shadow hover:shadow-md ${dim ? "opacity-40" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-gray-900 group-hover:text-brand-700 leading-snug">
          {topic.title}
        </h3>
        {topic.aiGenerated.length > 0 && (
          <span
            className="shrink-0 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-amber-800"
            title="Uvod i problemi su AI nacrt — još nisu pregledani"
          >
            AI
          </span>
        )}
      </div>
      <p className="mt-1.5 flex-1 text-sm text-gray-600 leading-relaxed">
        {topic.tagline}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
        <DifficultyBar difficulty={topic.difficulty} />
        {topic.difficulty && (
          <span>
            težina{" "}
            {topic.difficulty.min === topic.difficulty.max
              ? topic.difficulty.min
              : `${topic.difficulty.min}–${topic.difficulty.max}`}
          </span>
        )}
        <span>
          {topic.counts.materials} materijala
          {topic.counts.free > 0 && ` · ${topic.counts.free} besplatno`}
        </span>
        {topic.counts.problems > 0 && (
          <span>{topic.counts.problems} problema</span>
        )}
      </div>
      {topic.prerequisites.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          <span className="text-[11px] text-gray-400 mr-1 self-center">
            treba:
          </span>
          {topic.prerequisites.map((p) => (
            <span
              key={p}
              className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] text-gray-600"
            >
              {titles[p] ?? p}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
