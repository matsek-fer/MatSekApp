"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  CATEGORY_ORDER,
  type Category,
  type ConnectionSummary,
  type TopicSummary,
} from "@/lib/materials-meta";
import { MATERIALS } from "@/lib/i18n/materials";
import type { Lang } from "@/lib/i18n";
import StrengthDots from "./StrengthDots";
import { clipText } from "./text-width";

/*
 * The connections map is the undirected companion of the prerequisite map.
 * Topics sit on a circle in overview order and every connection is a chord
 * bent towards the centre, thicker the stronger the connection. A circle
 * suits a relation with no direction and no hierarchy, and it shows degree
 * without a layout algorithm: a topic that trades with many others has many
 * chords leaving it and a bigger dot. Hovering a topic or a chord brings
 * its connections forward and puts the tagline below the map; a click pins
 * that, and the pinned strip carries the links to the connection pages.
 *
 * Labels run along the radius, as in a chord diagram: horizontal labels
 * collide where neighbours sit side by side at the top and bottom, radial
 * ones never do. The longest titles are clipped to LABEL_PX; the full title
 * is in the strip and in the aria-label.
 */

const R = 190;
const LABEL_GAP = 10;
const LABEL_PX = 200;
const FONT_PX = 12;
const MAX_NODE_R = 14;
const EXTENT = R + MAX_NODE_R + LABEL_GAP + LABEL_PX + 8;
const W = 2 * EXTENT;
const H = 2 * EXTENT;
const CX = EXTENT;
const CY = EXTENT;
const STROKE: Record<number, number> = { 1: 1, 2: 1.8, 3: 2.8 };

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
  angle: number;
}

export default function ConnectionsMap({
  topics,
  titles,
  connections,
  matching,
  lang,
}: {
  topics: TopicSummary[];
  titles: Record<string, string>;
  connections: ConnectionSummary[];
  /** Ids that pass the current filters; others are faded. */
  matching: Set<string>;
  lang: Lang;
}) {
  const t = MATERIALS[lang];
  const [hoverNode, setHoverNode] = useState<string | null>(null);
  const [hoverEdge, setHoverEdge] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);

  const byId = useMemo(() => new Map(topics.map((x) => [x.id, x])), [topics]);
  const edges = useMemo(
    () => connections.filter((c) => byId.has(c.a) && byId.has(c.b)),
    [connections, byId]
  );
  const degree = useMemo(() => {
    const d = new Map<string, number>();
    for (const e of edges) {
      d.set(e.a, (d.get(e.a) ?? 0) + 1);
      d.set(e.b, (d.get(e.b) ?? 0) + 1);
    }
    return d;
  }, [edges]);
  const pos = useMemo(() => {
    const m = new Map<string, Pos>();
    topics.forEach((topic, i) => {
      const angle = -Math.PI / 2 + (2 * Math.PI * i) / topics.length;
      m.set(topic.id, { x: CX + R * Math.cos(angle), y: CY + R * Math.sin(angle), angle });
    });
    return m;
  }, [topics]);

  const focusEdge = hoverEdge ?? selectedEdge;
  const focusNode = focusEdge ? null : hoverNode ?? selectedNode;
  const lit = useMemo(() => {
    if (focusEdge) {
      const e = edges.find((x) => x.pair === focusEdge);
      return e ? { nodes: new Set([e.a, e.b]), edges: new Set([e.pair]) } : null;
    }
    if (focusNode) {
      const nodes = new Set([focusNode]);
      const es = new Set<string>();
      for (const e of edges)
        if (e.a === focusNode || e.b === focusNode) {
          es.add(e.pair);
          nodes.add(e.a);
          nodes.add(e.b);
        }
      return { nodes, edges: es };
    }
    return null;
  }, [focusEdge, focusNode, edges]);

  // A chord between neighbours stays close to the rim; a chord across the
  // circle is pulled to the centre, so the long ones bundle and the short
  // ones do not loop inwards.
  const chord = (e: ConnectionSummary) => {
    const a = pos.get(e.a)!;
    const b = pos.get(e.b)!;
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    const span = Math.hypot(b.x - a.x, b.y - a.y) / (2 * R);
    const k = 0.9 - 0.75 * span;
    return `M ${a.x} ${a.y} Q ${CX + (mx - CX) * k} ${CY + (my - CY) * k} ${b.x} ${b.y}`;
  };

  const shownEdge = focusEdge ? edges.find((x) => x.pair === focusEdge) : undefined;
  const shownNode = !shownEdge && focusNode ? byId.get(focusNode) : undefined;
  const nodeEdges = (id: string) =>
    edges
      .filter((e) => e.a === id || e.b === id)
      .sort((x, y) => y.strength - x.strength);
  const other = (e: ConnectionSummary, id: string) => (e.a === id ? e.b : e.a);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-fg-muted">
        {CATEGORY_ORDER.map((c) => (
          <span key={c} className="inline-flex items-center gap-1.5">
            <span className={cn("h-2.5 w-2.5 rounded-full", CATEGORY_DOT[c])} />
            {t.categories[c].label}
          </span>
        ))}
        <span className="ml-auto">{t.connectionsHint}</span>
      </div>

      <div
        className="overflow-x-auto rounded-xl border border-border bg-surface p-2"
        onClick={() => {
          setSelectedNode(null);
          setSelectedEdge(null);
        }}
      >
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          style={{ minWidth: 560, maxWidth: W }}
          className="mx-auto block"
          role="img"
          aria-label={t.connectionsAria}
        >
          <g fill="none">
            {edges.map((e) => {
              const on = lit ? lit.edges.has(e.pair) : false;
              const filtered = !matching.has(e.a) || !matching.has(e.b);
              const opacity = filtered ? 0.08 : lit ? (on ? 0.95 : 0.06) : 0.4;
              return (
                <g
                  key={e.pair}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoverEdge(e.pair)}
                  onMouseLeave={() => setHoverEdge(null)}
                  onClick={(ev) => {
                    ev.stopPropagation();
                    setSelectedNode(null);
                    setSelectedEdge(selectedEdge === e.pair ? null : e.pair);
                  }}
                >
                  <path d={chord(e)} className="stroke-fg" strokeWidth={12} opacity={0} />
                  <path
                    d={chord(e)}
                    className={on ? "stroke-brand" : "stroke-fg-muted"}
                    strokeWidth={STROKE[e.strength]}
                    strokeLinecap="round"
                    opacity={opacity}
                  />
                </g>
              );
            })}
          </g>

          {topics.map((topic) => {
            const p = pos.get(topic.id);
            if (!p) return null;
            const r = Math.min(MAX_NODE_R, 3.5 + (degree.get(topic.id) ?? 0));
            const on = lit ? lit.nodes.has(topic.id) : true;
            const faded = !matching.has(topic.id);
            const deg = (p.angle * 180) / Math.PI;
            const left = Math.cos(p.angle) < 0;
            const dist = MAX_NODE_R + LABEL_GAP;
            const label = clipText(titles[topic.id] ?? topic.id, LABEL_PX, FONT_PX);
            return (
              <g
                key={topic.id}
                className="cursor-pointer"
                opacity={faded ? 0.3 : on ? 1 : 0.25}
                onMouseEnter={() => setHoverNode(topic.id)}
                onMouseLeave={() => setHoverNode(null)}
                onClick={(ev) => {
                  ev.stopPropagation();
                  setSelectedEdge(null);
                  setSelectedNode(selectedNode === topic.id ? null : topic.id);
                }}
                role="button"
                tabIndex={0}
                aria-label={`${titles[topic.id] ?? topic.id}: ${t.nConnections(degree.get(topic.id) ?? 0)}`}
                onKeyDown={(ev) => {
                  if (ev.key === "Enter" || ev.key === " ") {
                    ev.preventDefault();
                    setSelectedEdge(null);
                    setSelectedNode(selectedNode === topic.id ? null : topic.id);
                  }
                }}
              >
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={r}
                  className={cn(CATEGORY_FILL[topic.category], "stroke-surface")}
                  strokeWidth={2}
                />
                <text
                  transform={`translate(${p.x} ${p.y}) rotate(${left ? deg + 180 : deg}) translate(${left ? -dist : dist} 0)`}
                  textAnchor={left ? "end" : "start"}
                  dominantBaseline="middle"
                  className={cn("text-[12px]", on && lit ? "fill-fg font-semibold" : "fill-fg font-medium")}
                >
                  {label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {shownEdge && (
        <div className="flex flex-col gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 font-medium text-fg">
              {titles[shownEdge.a]} ↔ {titles[shownEdge.b]}
              <StrengthDots strength={shownEdge.strength} lang={lang} />
            </div>
            <div className="mt-1 text-fg-muted">{shownEdge.tagline}</div>
          </div>
          <Link
            href={`/materials/connections/${shownEdge.pair}`}
            className="shrink-0 text-brand hover:underline"
          >
            {t.openConnection}
          </Link>
        </div>
      )}

      {shownNode && (
        <div className="rounded-xl border border-border bg-surface px-4 py-3 text-sm">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div className="font-medium text-fg">
              {shownNode.title}
              <span className="ml-2 text-xs text-fg-muted">
                {t.nConnections(degree.get(shownNode.id) ?? 0)}
              </span>
            </div>
            <Link href={`/materials/${shownNode.id}`} className="text-brand hover:underline">
              {t.openTopic}
            </Link>
          </div>
          <ul className="mt-2 grid gap-x-6 gap-y-1 sm:grid-cols-2">
            {nodeEdges(shownNode.id).map((e) => (
              <li key={e.pair} className="min-w-0">
                <Link
                  href={`/materials/connections/${e.pair}`}
                  className="inline-flex items-center gap-2 text-brand hover:underline"
                >
                  {titles[other(e, shownNode.id)]}
                  <StrengthDots strength={e.strength} lang={lang} />
                </Link>
                <span className="block truncate text-xs text-fg-muted">{e.tagline}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
