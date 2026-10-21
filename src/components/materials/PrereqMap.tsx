"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CATEGORY_META,
  CATEGORY_ORDER,
  type Category,
  type TopicSummary,
} from "@/lib/materials-meta";

const COL_W = 316;
const NODE_W = 236;
const NODE_H = 40;
const ROW_H = 58;
const PAD_X = 28;
const PAD_Y = 56;

/**
 * Prerequisite map: one column per category, an arrow from each topic to
 * the topics that build on it. Hovering a topic highlights what it needs
 * and what needs it; clicking opens the topic.
 */
export default function PrereqMap({
  topics,
  titles,
  matching,
}: {
  topics: TopicSummary[];
  titles: Record<string, string>;
  /** Ids that pass the current filters; others are faded. */
  matching: Set<string>;
}) {
  const router = useRouter();
  const [hover, setHover] = useState<string | null>(null);

  const layout = useMemo(() => {
    const cols = CATEGORY_ORDER.map((c) =>
      topics.filter((t) => t.category === c)
    );
    const pos = new Map<string, { x: number; y: number; col: number }>();
    cols.forEach((col, ci) => {
      col.forEach((t, ri) => {
        pos.set(t.id, {
          x: PAD_X + ci * COL_W,
          y: PAD_Y + ri * ROW_H,
          col: ci,
        });
      });
    });
    const rows = Math.max(...cols.map((c) => c.length), 1);
    const width = PAD_X * 2 + (CATEGORY_ORDER.length - 1) * COL_W + NODE_W;
    const height = PAD_Y + rows * ROW_H + 10;
    const edges: { from: string; to: string }[] = [];
    for (const t of topics)
      for (const p of t.prerequisites)
        if (pos.has(p)) edges.push({ from: p, to: t.id });
    return { pos, width, height, edges };
  }, [topics]);

  const related = useMemo(() => {
    if (!hover) return null;
    const s = new Set<string>([hover]);
    for (const e of layout.edges) {
      if (e.from === hover) s.add(e.to);
      if (e.to === hover) s.add(e.from);
    }
    return s;
  }, [hover, layout.edges]);

  const edgePath = (from: string, to: string) => {
    const a = layout.pos.get(from)!;
    const b = layout.pos.get(to)!;
    if (a.col === b.col) {
      // Same column: loop out to the right and back.
      const x = a.x + NODE_W;
      const y1 = a.y + NODE_H / 2;
      const y2 = b.y + NODE_H / 2;
      const bulge = 46;
      return `M ${x} ${y1} C ${x + bulge} ${y1}, ${x + bulge} ${y2}, ${x} ${y2}`;
    }
    const x1 = a.x + NODE_W;
    const y1 = a.y + NODE_H / 2;
    const x2 = b.x;
    const y2 = b.y + NODE_H / 2;
    const dx = (x2 - x1) / 2;
    return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
  };

  const edgeActive = (e: { from: string; to: string }) =>
    hover ? e.from === hover || e.to === hover : true;

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white p-2">
      <svg
        viewBox={`0 0 ${layout.width} ${layout.height}`}
        width="100%"
        style={{ minWidth: 760 }}
        role="img"
        aria-label="Karta preduvjeta među temama"
      >
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
          </marker>
        </defs>

        {CATEGORY_ORDER.map((c, ci) => (
          <text
            key={c}
            x={PAD_X + ci * COL_W}
            y={28}
            className="fill-gray-500 text-[13px] font-semibold uppercase tracking-wide"
          >
            {CATEGORY_META[c as Category].label}
          </text>
        ))}

        <g fill="none" strokeWidth={1.5}>
          {layout.edges.map((e) => {
            const active = edgeActive(e);
            return (
              <path
                key={`${e.from}->${e.to}`}
                d={edgePath(e.from, e.to)}
                className={
                  active
                    ? hover
                      ? "stroke-brand-500 text-brand-500"
                      : "stroke-gray-300 text-gray-300"
                    : "stroke-gray-200 text-gray-200"
                }
                markerEnd="url(#arrow)"
                opacity={active ? 1 : 0.35}
              />
            );
          })}
        </g>

        {topics.map((t) => {
          const p = layout.pos.get(t.id);
          if (!p) return null;
          const faded =
            (!matching.has(t.id)) || (related ? !related.has(t.id) : false);
          const isHover = hover === t.id;
          return (
            <g
              key={t.id}
              transform={`translate(${p.x} ${p.y})`}
              className="cursor-pointer"
              opacity={faded ? 0.3 : 1}
              onMouseEnter={() => setHover(t.id)}
              onMouseLeave={() => setHover(null)}
              onClick={() => router.push(`/materials/${t.id}`)}
              role="link"
              tabIndex={0}
              onKeyDown={(ev) => {
                if (ev.key === "Enter") router.push(`/materials/${t.id}`);
              }}
            >
              <rect
                width={NODE_W}
                height={NODE_H}
                rx={8}
                className={
                  isHover
                    ? "fill-brand-50 stroke-brand-500"
                    : "fill-white stroke-gray-300"
                }
                strokeWidth={1.2}
              />
              <text
                x={12}
                y={NODE_H / 2 + 4}
                className="fill-gray-900 text-[12.5px] font-medium"
              >
                {shorten(titles[t.id] ?? t.id)}
              </text>
              {t.difficulty && (
                <g transform={`translate(${NODE_W - 12 - 5 * 9} ${NODE_H / 2 - 3})`}>
                  {[1, 2, 3, 4, 5].map((l) => (
                    <rect
                      key={l}
                      x={(l - 1) * 9}
                      width={7}
                      height={6}
                      rx={1}
                      className={
                        l >= t.difficulty!.min && l <= t.difficulty!.max
                          ? "fill-brand-500"
                          : "fill-gray-200"
                      }
                    />
                  ))}
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/** Keep node labels to one line; the full title is on the topic page. */
function shorten(title: string) {
  const t = title.split(/ — | – |: /)[0];
  return t.length > 23 ? t.slice(0, 22).trimEnd() + "…" : t;
}
