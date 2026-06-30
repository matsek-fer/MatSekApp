"use client";

import React, { useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { Delaunay } from "d3-delaunay";

const NUM_SEEDS = 10;
const LINE_WIDTH = 1.2;
const ENTER_MS = 500;
const LEAVE_MS = 350;
const MAX_FRAMES = 300;
const STROKE = "rgba(71,85,105,0.15)";

/* ── component ────────────────────────────────────────────────── */

export default function VoronoiNavbarLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const frameNRef = useRef(0);
  const roRef = useRef<ResizeObserver | null>(null);

  const stateRef = useRef({ phase: "idle" as "idle" | "enter" | "complete" | "leave", progress: 0, start: 0 });
  const wasHoverRef = useRef(false);
  const seedsRef = useRef<number[] | null>(null);
  const polysRef = useRef<Array<Array<[number, number]>>>([]);
  const radiiRef = useRef<number[]>([]);
  const dimsRef = useRef({ w: 0, h: 0, dpr: 1 });

  /* ── helpers ────────────────────────────────────────────────── */

  const resize = useCallback(() => {
    const el = linkRef.current;
    const c = canvasRef.current;
    if (!el || !c) return;
    const r = el.getBoundingClientRect();
    const dp = devicePixelRatio || 1;
    const w = r.width, h = r.height;
    if (w <= 0 || h <= 0) return;
    if (dimsRef.current.w === w && dimsRef.current.h === h && dimsRef.current.dpr === dp) return;
    dimsRef.current = { w, h, dpr: dp };
    c.width = w * dp;
    c.height = h * dp;
    c.style.width = w + "px";
    c.style.height = h + "px";
  }, []);

  const voronoi = useCallback((): boolean => {
    const { w, h } = dimsRef.current;
    if (w <= 0 || h <= 0) return false;
    const m = 6;
    for (let retry = 0; retry < 3; retry++) {
      const s: number[] = [];
      for (let i = 0; i < NUM_SEEDS; i++) s.push(m + Math.random() * (w - 2 * m), m + Math.random() * (h - 2 * m));
      try {
        const v = new Delaunay(s).voronoi([0, 0, w, h]);
        const pp: Array<Array<[number, number]>> = [];
        const rr: number[] = [];
        for (let i = 0; i < NUM_SEEDS; i++) {
          const raw = v.cellPolygon(i);
          if (!raw) { pp.push([]); rr.push(0); continue; }
          const poly: Array<[number, number]> = [...raw.map(([x, y]) => [x, y] as [number, number]), [raw[0][0], raw[0][1]]];
          const sx = s[i * 2], sy = s[i * 2 + 1];
          let maxD = 0;
          for (const [vx, vy] of poly) { const d = Math.hypot(vx - sx, vy - sy); if (d > maxD) maxD = d; }
          pp.push(poly); rr.push(maxD + 2);
        }
        seedsRef.current = s; polysRef.current = pp; radiiRef.current = rr;
        return true;
      } catch { /* degenerate points — retry */ }
    }
    return false;
  }, []);

  const draw = useCallback((ts: number) => {
    frameNRef.current++;
    if (frameNRef.current > MAX_FRAMES) { stateRef.current.phase = "idle"; stateRef.current.progress = 0; return; }
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    const st = stateRef.current;
    const { w, h, dpr } = dimsRef.current;
    if (w <= 0 || h <= 0) { rafRef.current = requestAnimationFrame(draw); return; }

    // progress
    if (st.phase === "enter") {
      const raw = Math.min(1, (ts - st.start) / ENTER_MS);
      st.progress = 1 - (1 - raw) ** 3;
    } else if (st.phase === "leave") {
      const raw = Math.min(1, (ts - st.start) / LEAVE_MS);
      st.progress = Math.max(0, st.progress - raw);
    }
    const p = st.progress;

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);
    if (p <= 0 && st.phase === "leave") { ctx.restore(); st.phase = "idle"; st.progress = 0; return; }
    if (p <= 0) { ctx.restore(); return; } // idle or just-started enter — nothing to draw yet

    const pp = polysRef.current;
    const rr = radiiRef.current;
    const ss = seedsRef.current;
    if (!ss || pp.length === 0) { ctx.restore(); return; }

    ctx.strokeStyle = STROKE;
    ctx.lineWidth = LINE_WIDTH;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    for (let i = 0; i < NUM_SEEDS; i++) {
      const poly = pp[i];
      if (!poly || poly.length < 3) continue;
      const sx = ss[i * 2], sy = ss[i * 2 + 1], r = rr[i] * p;
      ctx.save();
      ctx.beginPath(); ctx.arc(sx, sy, r, 0, Math.PI * 2); ctx.clip();
      ctx.beginPath(); ctx.moveTo(poly[0][0], poly[0][1]);
      for (let j = 1; j < poly.length; j++) ctx.lineTo(poly[j][0], poly[j][1]);
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();

    if (st.phase === "enter" && p >= 1) { st.phase = "complete"; st.progress = 1; }
    if (st.phase === "leave" && p <= 0) { st.phase = "idle"; st.progress = 0; }
  }, []);

  /* ── main loop ──────────────────────────────────────────────── */

  const loop = useCallback((ts: number) => {
    const el = linkRef.current;
    const hovering = el ? el.matches(":hover") : false;
    const was = wasHoverRef.current;
    wasHoverRef.current = hovering;
    const st = stateRef.current;

    // only count frames during active animation
    if (st.phase === "enter" || st.phase === "leave") {
      frameNRef.current++;
      if (frameNRef.current > MAX_FRAMES) {
        st.phase = "idle"; st.progress = 0;
        rafRef.current = requestAnimationFrame(loop);
        return;
      }
    }

    // state transitions
    if (hovering && !was) {
      if (voronoi()) {
        frameNRef.current = 0;
        st.phase = "enter"; st.progress = 0; st.start = ts;
      }
    } else if (!hovering && was) {
      frameNRef.current = 0;
      if (st.progress > 0) { st.phase = "leave"; st.start = ts; }
      else { st.phase = "idle"; st.progress = 0; }
    } else if (hovering && st.phase === "leave") {
      frameNRef.current = 0;
      st.phase = "enter"; st.start = ts;
    }

    draw(ts);
    rafRef.current = requestAnimationFrame(loop);
  }, [voronoi, draw]);

  /* ── lifecycle ──────────────────────────────────────────────── */

  useEffect(() => {
    const el = linkRef.current;
    if (el) {
      roRef.current = new ResizeObserver(() => {
        resize();
        const st = stateRef.current;
        if ((st.phase === "complete" || st.phase === "enter") && st.progress > 0) {
          voronoi();
          st.progress = 1; st.phase = "complete";
        }
      });
      roRef.current.observe(el);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(rafRef.current); roRef.current?.disconnect(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── render ─────────────────────────────────────────────────── */

  return (
    <Link
      href={href}
      ref={linkRef}
      className={`relative inline-flex items-center px-3 py-5 text-gray-600 hover:text-brand-600 transition-colors ${className}`}
    >
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true" />
      <span className="relative z-10 pointer-events-none">{children}</span>
    </Link>
  );
}
