"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  eachHourOfInterval,
  eachMonthOfInterval,
  eachWeekOfInterval,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { hr } from "date-fns/locale";
import type { Activity } from "@/types";
import Button from "@/components/ui/Button";

/**
 * A zoomable strip of every event the page knows about.
 *
 * It opens on the whole history — first event to six months out — and drills in
 * a step at a time: hovering marks the month under the cursor, clicking zooms to
 * it, and the same gesture then offers a week, then a day. Reset is always on
 * screen, so no amount of drilling is a trap.
 */

const HEIGHT = 132;
const AXIS_Y = 62;
const PAD_X = 16;
const ZOOM_MS = 480;

/** Pixels below which two marks are drawn as one. See `cluster`. */
const MERGE_PX = 22;
/** Radius of a single event, and the ceiling however many pile up. */
const R_UNIT = 5;
const R_MAX = 26;

type Level = 0 | 1 | 2 | 3;

const LEVELS: {
  /** What one step of zoom selects at this level. */
  window: "month" | "week" | "day" | null;
  label: string;
}[] = [
  { window: "month", label: "cijela povijest" },
  { window: "week", label: "mjesec" },
  { window: "day", label: "tjedan" },
  { window: null, label: "dan" },
];

type Span = [number, number];

function windowAround(at: number, kind: "month" | "week" | "day"): Span {
  const d = new Date(at);
  if (kind === "month") return [+startOfMonth(d), +endOfMonth(d)];
  if (kind === "week")
    return [
      +startOfWeek(d, { weekStartsOn: 1 }),
      +endOfWeek(d, { weekStartsOn: 1 }),
    ];
  return [+startOfDay(d), +endOfDay(d)];
}

/**
 * Groups marks that would overlap on screen.
 *
 * The test is distance in pixels, not in time, which is what makes the display
 * adapt on its own: two events a week apart collide when the whole history is
 * on screen and separate once a month fills it, without the clustering knowing
 * anything about the zoom level. Each event is compared against the last one
 * placed rather than the group's centre, so a dense run chains into a single
 * large circle instead of breaking into evenly spaced clumps.
 */
function cluster(events: Activity[], x: (t: number) => number) {
  const sorted = [...events].sort(
    (a, b) => Date.parse(a.start_time) - Date.parse(b.start_time)
  );

  const groups: { items: Activity[]; lastX: number }[] = [];
  for (const event of sorted) {
    const px = x(Date.parse(event.start_time));
    const open = groups[groups.length - 1];
    if (open && px - open.lastX <= MERGE_PX) {
      open.items.push(event);
      open.lastX = px;
    } else {
      groups.push({ items: [event], lastX: px });
    }
  }

  return groups.map((g) => {
    const xs = g.items.map((e) => x(Date.parse(e.start_time)));
    return {
      items: g.items,
      cx: xs.reduce((a, b) => a + b, 0) / xs.length,
      // Area with the count, not radius: doubling the events should look like
      // twice as much, and radius-scaling would read as four times.
      r: Math.min(R_MAX, R_UNIT * Math.sqrt(g.items.length)),
    };
  });
}

function ticks(span: Span, level: Level, width: number) {
  const [from, to] = [new Date(span[0]), new Date(span[1])];
  const room = Math.max(2, Math.floor((width - PAD_X * 2) / 78));

  let all: Date[];
  let fmt: string;
  if (level === 0) {
    all = eachMonthOfInterval({ start: from, end: to });
    fmt = "LLL yy";
  } else if (level === 1) {
    all = eachWeekOfInterval({ start: from, end: to }, { weekStartsOn: 1 });
    fmt = "d. MMM";
  } else if (level === 2) {
    all = eachDayOfInterval({ start: from, end: to });
    fmt = "EEE d.";
  } else {
    all = eachHourOfInterval({ start: from, end: to });
    fmt = "HH:mm";
  }

  const step = Math.max(1, Math.ceil(all.length / room));
  return all.filter((_, i) => i % step === 0).map((d) => ({
    at: +d,
    label: format(d, fmt, { locale: hr }),
  }));
}

export default function ActivityTimeline({ events }: { events: Activity[] }) {
  const full = useMemo<Span>(() => {
    const times = events.map((e) => Date.parse(e.start_time));
    const end = +addMonths(new Date(), 6);
    const start = times.length ? Math.min(...times) : +addMonths(new Date(), -1);
    // A hair of margin, so the first event is not welded to the left edge.
    const pad = (end - start) * 0.02;
    return [start - pad, end];
  }, [events]);

  const [span, setSpan] = useState<Span>(full);
  const spanRef = useRef<Span>(full);
  const [level, setLevel] = useState<Level>(0);
  const [hover, setHover] = useState<Span | null>(null);
  const [picked, setPicked] = useState<number | null>(null);

  const wrap = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(720);
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // The domain is reset whenever the events change under it — a stale window
  // over a new set of events is a window onto nothing.
  useEffect(() => {
    spanRef.current = full;
    setSpan(full);
    setLevel(0);
  }, [full]);

  const inner = Math.max(1, width - PAD_X * 2);
  const toX = useCallback(
    (t: number) => PAD_X + ((t - span[0]) / (span[1] - span[0])) * inner,
    [span, inner]
  );
  const toTime = useCallback(
    (px: number) => span[0] + ((px - PAD_X) / inner) * (span[1] - span[0]),
    [span, inner]
  );

  const frame = useRef<number>();
  const animate = useCallback((target: Span) => {
    if (frame.current) cancelAnimationFrame(frame.current);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      spanRef.current = target;
      setSpan(target);
      return;
    }

    const from = spanRef.current;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / ZOOM_MS);
      const e = p < 0.5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2;
      const next: Span = [
        from[0] + (target[0] - from[0]) * e,
        from[1] + (target[1] - from[1]) * e,
      ];
      spanRef.current = next;
      setSpan(next);
      if (p < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => () => {
    if (frame.current) cancelAnimationFrame(frame.current);
  }, []);

  const kind = LEVELS[level].window;

  function pointerTime(e: React.PointerEvent<SVGSVGElement>) {
    const box = e.currentTarget.getBoundingClientRect();
    return toTime(e.clientX - box.left);
  }

  function handleMove(e: React.PointerEvent<SVGSVGElement>) {
    const box = e.currentTarget.getBoundingClientRect();
    setCursorX(e.clientX - box.left);
    if (!kind) return setHover(null);
    setHover(windowAround(pointerTime(e), kind));
  }

  function handleClick(e: React.PointerEvent<SVGSVGElement>) {
    if (!kind) return;
    const target = windowAround(pointerTime(e), kind);
    setLevel((l) => (l + 1) as Level);
    setPicked(target[0]);
    setHover(null);
    animate(target);
  }

  function reset() {
    setLevel(0);
    setPicked(null);
    setHover(null);
    animate(full);
  }

  // Only what is on screen: clustering the rest wastes work and, worse, counts
  // events into circles the viewer cannot see.
  const visible = useMemo(() => {
    const margin = ((span[1] - span[0]) / inner) * R_MAX;
    return events.filter((e) => {
      const t = Date.parse(e.start_time);
      return t >= span[0] - margin && t <= span[1] + margin;
    });
  }, [events, span, inner]);

  const groups = useMemo(() => cluster(visible, toX), [visible, toX]);

  /** The circle under the cursor, if any — read out beside the heading. */
  const [cursorX, setCursorX] = useState<number | null>(null);
  const focused =
    cursorX === null
      ? null
      : groups.find((g) => Math.abs(g.cx - cursorX) <= Math.max(g.r, 10)) ?? null;
  const marks = ticks(span, level, width);

  const heading =
    level === 0
      ? "Cijela povijest"
      : format(
          new Date(picked ?? span[0]),
          level === 1 ? "LLLL yyyy." : level === 2 ? "'tjedan od' d. MMMM" : "EEEE, d. MMMM yyyy.",
          { locale: hr }
        );

  return (
    <section aria-label="Vremenska crta aktivnosti" className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0 text-sm">
          <span className="font-medium text-fg">{heading}</span>
          {focused ? (
            <span className="ml-2 truncate text-fg-muted">
              {focused.items.length === 1
                ? focused.items[0].title
                : `${focused.items.length} aktivnosti`}
              {" · "}
              {format(new Date(focused.items[0].start_time), "d. MMM", {
                locale: hr,
              })}
              {focused.items.length > 1 &&
                ` – ${format(
                  new Date(focused.items[focused.items.length - 1].start_time),
                  "d. MMM",
                  { locale: hr }
                )}`}
            </span>
          ) : (
            kind && (
              <span className="ml-2 text-fg-subtle">
                klikni za{" "}
                {kind === "month" ? "mjesec" : kind === "week" ? "tjedan" : "dan"}
              </span>
            )
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={reset}
          disabled={level === 0}
        >
          ⟲ Cijeli raspon
        </Button>
      </div>

      <div
        ref={wrap}
        className="rounded-xl border border-border bg-surface px-1 py-2"
      >
        <svg
          width="100%"
          height={HEIGHT}
          viewBox={`0 0 ${width} ${HEIGHT}`}
          className={kind ? "cursor-zoom-in" : "cursor-default"}
          onPointerMove={handleMove}
          onPointerLeave={() => {
            setHover(null);
            setCursorX(null);
          }}
          onPointerDown={handleClick}
          role="img"
          aria-label={`${events.length} aktivnosti na vremenskoj crti, prikaz: ${LEVELS[level].label}`}
        >
          {hover && (
            <rect
              x={toX(hover[0])}
              y={8}
              width={Math.max(2, toX(hover[1]) - toX(hover[0]))}
              height={HEIGHT - 40}
              className="fill-brand/15 stroke-brand/40"
              rx={6}
            />
          )}

          <line
            x1={PAD_X}
            x2={width - PAD_X}
            y1={AXIS_Y}
            y2={AXIS_Y}
            className="stroke-border-strong"
            strokeWidth={1}
          />

          {marks.map((m) => (
            <g key={m.at}>
              <line
                x1={toX(m.at)}
                x2={toX(m.at)}
                y1={AXIS_Y}
                y2={AXIS_Y + 6}
                className="stroke-border-strong"
              />
              <text
                x={toX(m.at)}
                y={AXIS_Y + 20}
                textAnchor="middle"
                className="fill-fg-subtle text-[10px]"
              >
                {m.label}
              </text>
            </g>
          ))}

          {/* Now, so the split between what happened and what is coming is visible. */}
          <line
            x1={toX(Date.now())}
            x2={toX(Date.now())}
            y1={12}
            y2={AXIS_Y}
            className="stroke-brand"
            strokeDasharray="3 3"
          />

          {groups.length === 0 && (
            <text
              x={width / 2}
              y={AXIS_Y - 14}
              textAnchor="middle"
              className="fill-fg-subtle text-[11px]"
            >
              nema aktivnosti u ovom rasponu
            </text>
          )}

          {groups.map((g, i) => (
            <g key={i}>
              <circle
                cx={g.cx}
                cy={AXIS_Y}
                r={g.r}
                className={
                  focused === g
                    ? "fill-brand/50 stroke-brand"
                    : "fill-brand/25 stroke-brand"
                }
              />
              {g.items.length > 1 && (
                <text
                  x={g.cx}
                  y={AXIS_Y + 3.5}
                  textAnchor="middle"
                  className="fill-fg text-[10px] font-medium"
                >
                  {g.items.length}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>
    </section>
  );
}
