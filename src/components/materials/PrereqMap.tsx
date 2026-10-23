"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  CATEGORY_ORDER,
  type Category,
  type TopicSummary,
} from "@/lib/materials-meta";
import { MATERIALS } from "@/lib/i18n/materials";
import type { Lang } from "@/lib/i18n";

const NODE_W = 204;
const NODE_H = 46;
const LAYER_W = 270;
const ROW_H = 58;
/** Label budget in px: the label starts 14px in, the difficulty squares at 154px. */
const LABEL_PX = 136;
const PAD_X = 20;
const PAD_Y = 24;

/*
 * The map is laid out by dependency depth, not by category: a topic sits one
 * layer to the right of its deepest prerequisite, so every arrow points
 * right and no arrow has to loop back into its own column. Category is shown
 * as a coloured bar on the node instead. Within a layer, nodes are ordered
 * by the average position of what they connect to (three barycentre sweeps),
 * which removes most crossings for a graph this size. Edges are faint until a
 * topic is hovered or selected, when its own edges and neighbours light up —
 * the full graph is a hint of shape, the selection is the readable part.
 */

const CATEGORY_FILL: Record<Category, string> = {
  classical: "fill-brand",
  language: "fill-success",
  advanced: "fill-warning",
  general: "fill-fg-subtle",
};

const CATEGORY_DOT: Record<Category, string> = {
  classical: "bg-brand",
  language: "bg-success",
  advanced: "bg-warning",
  general: "bg-fg-subtle",
};

interface Pos {
  x: number;
  y: number;
  layer: number;
}

export function layout(topics: TopicSummary[]) {
  const byId = new Map(topics.map((t) => [t.id, t]));
  const depth = new Map<string, number>();
  const visiting = new Set<string>();
  const depthOf = (id: string): number => {
    const known = depth.get(id);
    if (known !== undefined) return known;
    if (visiting.has(id)) return 0; // a cycle in the content: break it
    visiting.add(id);
    const t = byId.get(id);
    const d = t
      ? t.prerequisites
          .filter((p) => byId.has(p))
          .reduce((m, p) => Math.max(m, depthOf(p) + 1), 0)
      : 0;
    visiting.delete(id);
    depth.set(id, d);
    return d;
  };
  topics.forEach((t) => depthOf(t.id));

  const layerCount = Math.max(...Array.from(depth.values()), 0) + 1;
  const layers: string[][] = Array.from({ length: layerCount }, () => []);
  const stableIndex = new Map(topics.map((t, i) => [t.id, i]));
  topics
    .slice()
    .sort((a, b) => {
      const ca = CATEGORY_ORDER.indexOf(a.category);
      const cb = CATEGORY_ORDER.indexOf(b.category);
      return ca !== cb ? ca - cb : a.order - b.order;
    })
    .forEach((t) => layers[depth.get(t.id)!].push(t.id));

  const edges: { from: string; to: string }[] = [];
  for (const t of topics)
    for (const p of t.prerequisites)
      if (byId.has(p)) edges.push({ from: p, to: t.id });

  const row = new Map<string, number>();
  const assign = () =>
    layers.forEach((l) => l.forEach((id, i) => row.set(id, i)));
  assign();

  // Barycentre sweeps: order each layer by the mean row of its neighbours
  // in the layer already placed, forwards (by prerequisites) then backwards
  // (by dependents), then forwards once more to settle. Half the edges span
  // more than one layer and are invisible to this, but counting neighbours
  // in every placed layer, weighted by distance or not, and sweeping seven
  // times instead of three all measured worse on the real graph (181–184
  // straight-segment crossings against 178), so the simple rule stays.
  const sweep = (forward: boolean) => {
    const range = forward
      ? layers.map((_, i) => i).slice(1)
      : layers.map((_, i) => i).slice(0, -1).reverse();
    for (const li of range) {
      const score = new Map<string, number>();
      for (const id of layers[li]) {
        const nbrs = edges
          .filter((e) => (forward ? e.to === id : e.from === id))
          .map((e) => (forward ? e.from : e.to))
          .filter((n) => depth.get(n) === (forward ? li - 1 : li + 1));
        const mean = nbrs.length
          ? nbrs.reduce((s, n) => s + (row.get(n) ?? 0), 0) / nbrs.length
          : row.get(id) ?? 0;
        score.set(id, mean);
      }
      layers[li].sort(
        (a, b) =>
          score.get(a)! - score.get(b)! ||
          stableIndex.get(a)! - stableIndex.get(b)!
      );
      assign();
    }
  };
  sweep(true);
  sweep(false);
  sweep(true);

  const tallest = Math.max(...layers.map((l) => l.length), 1);
  const height = PAD_Y * 2 + tallest * ROW_H - (ROW_H - NODE_H);
  const pos = new Map<string, Pos>();
  layers.forEach((l, li) => {
    const offset = ((tallest - l.length) * ROW_H) / 2;
    l.forEach((id, ri) => {
      pos.set(id, {
        x: PAD_X + li * LAYER_W,
        y: PAD_Y + offset + ri * ROW_H,
        layer: li,
      });
    });
  });
  const width = PAD_X * 2 + (layerCount - 1) * LAYER_W + NODE_W;
  return { pos, edges, width, height };
}

/** Prerequisite map: see the comment at the top of the file. */
export default function PrereqMap({
  topics,
  titles,
  matching,
  lang,
}: {
  topics: TopicSummary[];
  titles: Record<string, string>;
  /** Ids that pass the current filters; others are faded. */
  matching: Set<string>;
  lang: Lang;
}) {
  const t = MATERIALS[lang];
  const router = useRouter();
  const [hover, setHover] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const focus = hover ?? selected;

  const g = useMemo(() => layout(topics), [topics]);
  const byId = useMemo(() => new Map(topics.map((topic) => [topic.id, topic])), [topics]);

  const related = useMemo(() => {
    if (!focus) return null;
    const s = new Set<string>([focus]);
    for (const e of g.edges) {
      if (e.from === focus) s.add(e.to);
      if (e.to === focus) s.add(e.from);
    }
    return s;
  }, [focus, g.edges]);

  const path = (from: string, to: string) => {
    const a = g.pos.get(from)!;
    const b = g.pos.get(to)!;
    const x1 = a.x + NODE_W;
    const y1 = a.y + NODE_H / 2;
    const x2 = b.x;
    const y2 = b.y + NODE_H / 2;
    const dx = Math.max((x2 - x1) * 0.5, 40);
    return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
  };

  const open = (id: string) => router.push(`/materials/${id}`);
  const sel = selected ? byId.get(selected) : null;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-fg-muted">
        {CATEGORY_ORDER.map((c) => (
          <span key={c} className="inline-flex items-center gap-1.5">
            <span className={cn("h-2.5 w-2.5 rounded-sm", CATEGORY_DOT[c])} />
            {t.categories[c].label}
          </span>
        ))}
        <span className="ml-auto">{t.mapHint}</span>
      </div>

      <div
        className="overflow-x-auto rounded-xl border border-border bg-surface p-2"
        onClick={() => setSelected(null)}
      >
        <svg
          viewBox={`0 0 ${g.width} ${g.height}`}
          width="100%"
          style={{ minWidth: Math.min(g.width, 1100) }}
          role="img"
          aria-label={t.mapAria}
        >
          <defs>
            <marker
              id="arrow-active"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" className="fill-brand" />
            </marker>
          </defs>

          <g fill="none">
            {g.edges.map((e) => {
              const active = focus
                ? e.from === focus || e.to === focus
                : false;
              const dimmed = focus ? !active : false;
              return (
                <path
                  key={`${e.from}->${e.to}`}
                  d={path(e.from, e.to)}
                  className={active ? "stroke-brand" : "stroke-border-strong"}
                  strokeWidth={active ? 2 : 1.2}
                  opacity={dimmed ? 0.18 : active ? 1 : 0.7}
                  markerEnd={active ? "url(#arrow-active)" : undefined}
                />
              );
            })}
          </g>

          {topics.map((topic) => {
            const p = g.pos.get(topic.id);
            if (!p) return null;
            const faded =
              !matching.has(topic.id) || (related ? !related.has(topic.id) : false);
            const isFocus = focus === topic.id;
            return (
              <g
                key={topic.id}
                transform={`translate(${p.x} ${p.y})`}
                className="cursor-pointer"
                opacity={faded ? 0.3 : 1}
                onMouseEnter={() => setHover(topic.id)}
                onMouseLeave={() => setHover(null)}
                onClick={(ev) => {
                  ev.stopPropagation();
                  if (selected === topic.id) open(topic.id);
                  else setSelected(topic.id);
                }}
                role="button"
                tabIndex={0}
                aria-label={titles[topic.id] ?? topic.id}
                onKeyDown={(ev) => {
                  if (ev.key === "Enter") open(topic.id);
                  if (ev.key === " ") {
                    ev.preventDefault();
                    setSelected(selected === topic.id ? null : topic.id);
                  }
                }}
              >
                <rect
                  width={NODE_W}
                  height={NODE_H}
                  rx={8}
                  className={cn(
                    "fill-surface",
                    isFocus ? "stroke-brand" : "stroke-border-strong"
                  )}
                  strokeWidth={isFocus ? 1.8 : 1.2}
                />
                <rect
                  x={0}
                  y={6}
                  width={4}
                  height={NODE_H - 12}
                  rx={2}
                  className={CATEGORY_FILL[topic.category]}
                />
                {(() => {
                  const lines = wrap(titles[topic.id] ?? topic.id);
                  const y0 = lines.length === 1 ? NODE_H / 2 + 4 : NODE_H / 2 - 3;
                  return (
                    <text
                      x={14}
                      y={y0}
                      className="fill-fg text-[12.5px] font-medium"
                    >
                      {lines.map((line, i) => (
                        <tspan key={i} x={14} dy={i === 0 ? 0 : 14}>
                          {line}
                        </tspan>
                      ))}
                    </text>
                  );
                })()}
                {topic.difficulty && (
                  <g transform={`translate(${NODE_W - 10 - 5 * 8} ${NODE_H / 2 - 3})`}>
                    {[1, 2, 3, 4, 5].map((l) => (
                      <rect
                        key={l}
                        x={(l - 1) * 8}
                        width={6}
                        height={6}
                        rx={1}
                        className={
                          l >= topic.difficulty!.min && l <= topic.difficulty!.max
                            ? "fill-brand"
                            : "fill-border"
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

      {sel && (
        <div className="flex flex-col gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="font-medium text-fg">{sel.title}</div>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-fg-muted">
              {sel.prerequisites.length > 0 && (
                <span>
                  {t.prerequisites}{" "}
                  {sel.prerequisites.map((p) => titles[p] ?? p).join(", ")}
                </span>
              )}
              {sel.requiredBy.length > 0 && (
                <span>
                  {t.leadsTo}{" "}
                  {sel.requiredBy.map((p) => titles[p] ?? p).join(", ")}
                </span>
              )}
            </div>
          </div>
          <Link
            href={`/materials/${sel.id}`}
            className="shrink-0 text-brand hover:underline"
          >
            {t.openTopic}
          </Link>
        </div>
      )}
    </div>
  );
}

/*
 * Advance widths of Inter Medium at 12.5px, measured in Chromium with
 * getComputedTextLength on the map's own <text> element. A character count
 * cannot do this job: "differential equations" is 22 characters and 128px,
 * "Higher category theory" is 22 characters and 139px, and a four-bucket
 * estimate still missed by 7% on the latter. Unknown characters get a
 * typical lowercase width.
 */
const CHAR_PX = new Map<string, number>();
for (const [px, chars] of [
  [3.1, "ijl"], [3.4, " I"], [3.5, "’"], [3.8, ",.:"], [3.9, ";'"], [4.2, "t"],
  [4.4, "f"], [4.6, "()/"], [4.9, "r"], [5.2, "1"], [5.8, "-"], [6.2, "–"],
  [6.7, "sš"], [7.0, "kxzž"], [7.1, "aL"], [7.2, "cvyJćč"], [7.3, "e7"],
  [7.4, "F"], [7.5, "hnouE"], [7.7, "bdgpqđ2"], [7.8, "3"], [7.9, "689"],
  [8.0, "PZŽ"], [8.1, "0&RSTŠ"], [8.2, "B4"], [8.6, "K"], [8.7, "XY"],
  [9.0, "ADV"], [9.2, "CUČĆ"], [9.3, "GHĐ"], [9.4, "N"], [9.6, "OQ"],
  [10.3, "w"], [11.1, "m"], [11.4, "M…"], [12.5, "—"], [12.7, "W"],
] as const)
  for (const ch of chars) CHAR_PX.set(ch, px);

function textWidth(s: string): number {
  let w = 0;
  for (const ch of s) w += CHAR_PX.get(ch) ?? 7.5;
  return w;
}

/**
 * Node labels get at most two lines of LABEL_PX; the full title is on the
 * topic page. Words are packed greedily, and a line that still does not fit
 * is cut with an ellipsis.
 */
function wrap(title: string): string[] {
  const words = title.split(/ — | – |: /)[0].split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if (!cur) cur = w;
    else if (textWidth(cur + " " + w) <= LABEL_PX) cur += " " + w;
    else {
      lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  if (lines.length > 2) lines.splice(1, lines.length - 1, lines.slice(1).join(" "));
  return lines.map((line) => {
    if (textWidth(line) <= LABEL_PX) return line;
    let cut = line;
    while (cut.length > 1 && textWidth(cut + "…") > LABEL_PX) cut = cut.slice(0, -1);
    return cut.trimEnd() + "…";
  });
}
