import Link from "next/link";
import type { TopicSummary } from "@/lib/materials-meta";

/**
 * One row of the overview: the topic's title, and the topics it needs. No
 * tagline, difficulty or counts — those were the page's noise, and a
 * reader deciding where to go next is better served by the structure
 * (what comes before what) than by a summary of each entry.
 */
export default function TopicCard({
  topic,
  titles,
}: {
  topic: TopicSummary;
  titles: Record<string, string>;
}) {
  return (
    <li>
      <Link
        href={`/materials/${topic.id}`}
        className="group flex flex-col gap-1 px-4 py-3 transition-colors hover:bg-surface-hover
                   sm:flex-row sm:items-center sm:justify-between sm:gap-4"
      >
        <span className="font-medium text-fg group-hover:text-brand">
          {topic.title}
        </span>
        {topic.prerequisites.length > 0 && (
          <span className="flex flex-wrap items-center gap-1 sm:justify-end">
            <span className="mr-1 text-[11px] text-fg-subtle">treba:</span>
            {topic.prerequisites.map((p) => (
              <span
                key={p}
                className="rounded bg-surface-hover px-1.5 py-0.5 text-[11px] text-fg-muted"
              >
                {titles[p] ?? p}
              </span>
            ))}
          </span>
        )}
      </Link>
    </li>
  );
}
