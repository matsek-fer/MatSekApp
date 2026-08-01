"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  addMonths,
  eachDayOfInterval,
  eachHourOfInterval,
  eachMonthOfInterval,
  eachWeekOfInterval,
  format,
} from "date-fns";
import { hr } from "date-fns/locale";
import type { Activity } from "@/types";
import Button from "@/components/ui/Button";

/**
 * A zoomable strip of every event the page knows about.
 *
 * It opens on the whole history — first event to six months out — and drills in
 * a step at a time: the band under the cursor is what a click will zoom to,
 * first a month, then a week, then a day. Reset is on screen at every level.
 *
 * The band is not snapped to calendar boundaries. It is a window of fixed
 * length centred on the cursor, so it slides with the pointer instead of
 * jumping between months, which is what makes aiming at a cluster feel like
 * aiming rather than guessing which side of a boundary it falls on.
 */

const HEIGHT = 190;
const AXIS_Y = 104;
const PAD_X = 34;
const ZOOM_MS = 480;

const DAY = 86_400_000;

/** Pixels below which two marks are drawn as one. See `cluster`. */
const MERGE_PX = 24;
/**
 * ...and the longest stretch of time one circle may stand for. Without it a
 * dense season collapses into a single blob that says only "lots, somewhere in
 * here", which is no more use than no timeline at all.
 */
const MERGE_MAX_SPAN = 21 * DAY;

const R_UNIT = 7;
const R_MAX = 30;

type Level = 0 | 1 | 2 | 3;
type Span = [number, number];

/** Half-length of the band a click will zoom to, per level. */
const BAND_HALF: (number | null)[] = [15 * DAY, 3.5 * DAY, 0.5 * DAY, null];
const BAND_NAME = ["mjesec", "tjedan", "dan", ""];

function cluster(events: Activity[], x: (t: number) => number) {
  const sorted = [...events].sort(
    (a, b) => Date.parse(a.start_time) - Date.parse(b.start_time)
  );

  const groups: { items: Activity[]; lastX: number; from: number }[] = [];
  for (const event of sorted) {
    const t = Date.parse(event.start_time);
    const px = x(t);
    const open = groups[groups.length - 1];
    // Close enough to overlap on screen *and* close enough in time to be one
    // period worth naming. Either test alone gives a bad circle: pixels alone
    // swallow a whole season at the widest zoom, time alone leaves circles
    // sitting on top of each other.
    if (open && px - open.lastX <= MERGE_PX && t - open.from <= MERGE_MAX_SPAN) {
      open.items.push(event);
      open.lastX = px;
    } else {
      groups.push({ items: [event], lastX: px, from: t });
    }
  }

  return groups.map((g, i) => {
    const xs = g.items.map((e) => x(Date.parse(e.start_time)));
    return {
      key: `${i}-${g.from}`,
      items: g.items,
      cx: xs.reduce((a, b) => a + b, 0) / xs.length,
      // Area with the count, not radius: doubling the events should look like
      // twice as much, and radius-scaling would read as four times.
      r: Math.min(R_MAX, R_UNIT * Math.sqrt(g.items.length)),
    };
  });
}

type Cluster = ReturnType<typeof cluster>[number];

function ticks(span: Span, level: Level, width: number) {
  const [from, to] = [new Date(span[0]), new Date(span[1])];
  const room = Math.max(2, Math.floor((width - PAD_X * 2) / 84));

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
  return all
    .filter((_, i) => i % step === 0)
    .map((d) => ({ at: +d, label: format(d, fmt, { locale: hr }) }));
}

function when(a: Activity) {
  return format(new Date(a.start_time), "d. MMM yyyy. 'u' HH:mm", { locale: hr });
}

export default function ActivityTimeline({ events }: { events: Activity[] }) {
  const full = useMemo<Span>(() => {
    const times = events.map((e) => Date.parse(e.start_time));
    const end = +addMonths(new Date(), 6);
    const start = times.length ? Math.min(...times) : +addMonths(new Date(), -1);
    const pad = (end - start) * 0.02;
    return [start - pad, end];
  }, [events]);

  const [span, setSpan] = useState<Span>(full);
  const spanRef = useRef<Span>(full);
  const [level, setLevel] = useState<Level>(0);
  const [cursor, setCursor] = useState<number | null>(null);
  const [opened, setOpened] = useState<Cluster | null>(null);

  const wrap = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(760);
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

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
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
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

  useEffect(
    () => () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    },
    []
  );

  const half = BAND_HALF[level];
  const groups = useMemo(() => {
    const margin = ((span[1] - span[0]) / inner) * R_MAX;
    const visible = events.filter((e) => {
      const t = Date.parse(e.start_time);
      return t >= span[0] - margin && t <= span[1] + margin;
    });
    return cluster(visible, toX);
  }, [events, span, inner, toX]);

  /** The circle under the cursor. While there is one, the band stays hidden. */
  const hovered =
    cursor === null
      ? null
      : groups.find((g) => Math.abs(g.cx - cursor) <= Math.max(g.r, 12)) ?? null;

  const band: Span | null =
    cursor === null || half === null || hovered
      ? null
      : [toTime(cursor) - half, toTime(cursor) + half];

  function handleMove(e: React.PointerEvent<SVGSVGElement>) {
    setCursor(e.clientX - e.currentTarget.getBoundingClientRect().left);
  }

  function handleDown(e: React.PointerEvent<SVGSVGElement>) {
    if (hovered) {
      setOpened(hovered);
      return;
    }
    if (!band) return;
    setLevel((l) => (l + 1) as Level);
    setCursor(null);
    animate(band);
  }

  function reset() {
    setLevel(0);
    setCursor(null);
    animate(full);
  }

  /** Shifts the window without changing how much of it is on screen. */
  function pan(direction: -1 | 1) {
    const [a, b] = spanRef.current;
    const step = (b - a) * 0.6 * direction;
    let next: Span = [a + step, b + step];
    if (next[0] < full[0]) next = [full[0], full[0] + (b - a)];
    if (next[1] > full[1]) next = [full[1] - (b - a), full[1]];
    setCursor(null);
    animate(next);
  }

  const canPan = level > 0;
  const atStart = span[0] <= full[0] + 1;
  const atEnd = span[1] >= full[1] - 1;

  // Escape closes the opened list, as it would any other overlay.
  useEffect(() => {
    if (!opened) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpened(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [opened]);

  const marks = ticks(span, level, width);
  const heading =
    level === 0
      ? "Cijela povijest"
      : format(
          new Date((span[0] + span[1]) / 2),
          level === 1 ? "LLLL yyyy." : level === 2 ? "'tjedan oko' d. MMMM" : "EEEE, d. MMMM",
          { locale: hr }
        );

  return (
    <section aria-label="Vremenska crta aktivnosti" className="space-y-1 pt-2">
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="min-w-0 text-sm">
          <span className="font-medium text-fg">{heading}</span>
          {hovered ? (
            <span className="ml-2 text-fg-muted">
              {hovered.items.length === 1
                ? hovered.items[0].title
                : `${hovered.items.length} aktivnosti`}
            </span>
          ) : (
            half !== null && (
              <span className="ml-2 text-fg-subtle">
                klikni za {BAND_NAME[level]}
              </span>
            )
          )}
        </div>

        <Button variant="ghost" size="sm" onClick={reset} disabled={level === 0}>
          ⟲ Cijeli raspon
        </Button>
      </div>

      {/* No frame: the strip floats on the page. */}
      <div ref={wrap} className="relative">
        <svg
          width="100%"
          height={HEIGHT}
          viewBox={`0 0 ${width} ${HEIGHT}`}
          className={hovered ? "cursor-pointer" : half ? "cursor-zoom-in" : "cursor-default"}
          onPointerMove={handleMove}
          onPointerLeave={() => setCursor(null)}
          onPointerDown={handleDown}
          role="img"
          aria-label={`${events.length} aktivnosti na vremenskoj crti`}
        >
          <defs>
            <filter id="tl-glow" x="-120%" y="-120%" width="340%" height="340%">
              <feGaussianBlur stdDeviation="4.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <marker
              id="tl-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" className="fill-fg-subtle" />
            </marker>
          </defs>

          {band && (
            <rect
              x={toX(band[0])}
              y={22}
              width={Math.max(2, toX(band[1]) - toX(band[0]))}
              height={HEIGHT - 66}
              rx={8}
              fill="rgb(251 146 60 / 0.10)"
              stroke="rgb(251 146 60 / 0.45)"
            />
          )}

          <line
            x1={PAD_X - 12}
            x2={width - PAD_X + 12}
            y1={AXIS_Y}
            y2={AXIS_Y}
            className="stroke-border-strong"
            strokeWidth={1.5}
            markerStart="url(#tl-arrow)"
            markerEnd="url(#tl-arrow)"
          />

          {marks.map((m) => (
            <g key={m.at}>
              <line
                x1={toX(m.at)}
                x2={toX(m.at)}
                y1={AXIS_Y}
                y2={AXIS_Y + 7}
                className="stroke-border-strong"
              />
              <text
                x={toX(m.at)}
                y={AXIS_Y + 23}
                textAnchor="middle"
                className="fill-fg-subtle text-[11px]"
              >
                {m.label}
              </text>
            </g>
          ))}

          <line
            x1={toX(Date.now())}
            x2={toX(Date.now())}
            y1={26}
            y2={AXIS_Y}
            className="stroke-fg-subtle"
            strokeDasharray="3 4"
          />

          {groups.length === 0 && (
            <text
              x={width / 2}
              y={AXIS_Y - 26}
              textAnchor="middle"
              className="fill-fg-subtle text-[12px]"
            >
              nema aktivnosti u ovom rasponu
            </text>
          )}

          <g filter="url(#tl-glow)">
            {groups.map((g) => (
              <circle
                key={g.key}
                cx={g.cx}
                cy={AXIS_Y}
                r={g.r}
                fill={
                  hovered === g || opened?.key === g.key
                    ? "rgb(253 186 116 / 0.85)"
                    : "rgb(249 115 22 / 0.55)"
                }
                stroke={hovered === g ? "rgb(254 215 170)" : "rgb(251 146 60)"}
                strokeWidth={1.5}
              />
            ))}
          </g>

          {groups.map((g) =>
            g.items.length > 1 ? (
              <text
                key={`n-${g.key}`}
                x={g.cx}
                y={AXIS_Y + 4}
                textAnchor="middle"
                className="pointer-events-none text-[11px] font-semibold"
                fill="rgb(28 25 23)"
              >
                {g.items.length}
              </text>
            ) : null
          )}
        </svg>

        {/* Arrows are live controls once zoomed: nothing else moves the window
            sideways, and re-zooming from the top to see the next week is a
            silly amount of work. */}
        {canPan && (
          <>
            <button
              type="button"
              onClick={() => pan(-1)}
              disabled={atStart}
              aria-label="Prikaži raniji raspon"
              className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full px-2 py-3
                         text-lg text-fg-muted transition-colors hover:text-fg
                         disabled:opacity-25"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => pan(1)}
              disabled={atEnd}
              aria-label="Prikaži kasniji raspon"
              className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full px-2 py-3
                         text-lg text-fg-muted transition-colors hover:text-fg
                         disabled:opacity-25"
            >
              ›
            </button>
          </>
        )}

        {/* Peek: what is in the circle under the cursor, beside the circle. */}
        {hovered && !opened && (
          <div
            className="pointer-events-none absolute z-10 w-64 rounded-xl border border-border
                       bg-surface p-3 shadow-lg"
            style={{
              left: Math.min(Math.max(hovered.cx - 128, 0), Math.max(0, width - 256)),
              top: 0,
            }}
          >
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-fg-subtle">
              {hovered.items.length === 1
                ? "1 aktivnost"
                : `${hovered.items.length} aktivnosti`}
            </p>
            <ul className="space-y-1">
              {hovered.items.slice(0, 3).map((a) => (
                <li key={a.id} className="truncate text-sm text-fg">
                  {a.title}
                  <span className="ml-1 text-fg-subtle">{when(a)}</span>
                </li>
              ))}
            </ul>
            {hovered.items.length > 3 && (
              <p className="mt-1 text-xs text-fg-subtle">
                +{hovered.items.length - 3} više · klikni za sve
              </p>
            )}
          </div>
        )}
      </div>

      {opened && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setOpened(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Aktivnosti u odabranom razdoblju"
        >
          <div
            className="max-h-[70vh] w-full max-w-lg overflow-y-auto rounded-2xl border
                       border-border bg-surface p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="font-semibold text-fg">
                {opened.items.length === 1
                  ? "1 aktivnost"
                  : `${opened.items.length} aktivnosti`}
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setOpened(null)}>
                Zatvori
              </Button>
            </div>

            <ul className="space-y-2">
              {opened.items.map((a) => (
                <li key={a.id}>
                  <Link
                    href={`/activities/${a.id}`}
                    className="block rounded-lg border border-border p-3
                               transition-colors hover:border-brand/40 hover:bg-surface-hover"
                  >
                    <p className="font-medium text-fg">{a.title}</p>
                    <p className="text-sm text-fg-muted">{when(a)}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
