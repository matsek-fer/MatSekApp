"use client";

import { useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { Delaunay } from "d3-delaunay";
import { cn } from "@/lib/utils";

const NUM_SEEDS = 10;
const LINE_WIDTH = 1.2;
const LINE_ALPHA = 0.18;
const ENTER_MS = 500;
const LEAVE_MS = 350;
const INSET = 6; // keep seeds off the edges so cells stay well-formed

type Phase = "idle" | "enter" | "complete" | "leave";

/** Ease-out cubic, and its inverse — used to resume mid-animation without a jump. */
const ease = (t: number) => 1 - (1 - t) ** 3;
const easeInverse = (p: number) => 1 - (1 - p) ** (1 / 3);

/**
 * Navbar link that grows a Voronoi mesh out of random seed points on hover.
 *
 * The animation is driven by pointer events and the rAF loop only runs while
 * something is actually moving — once the mesh is fully drawn the canvas simply
 * holds its last frame at zero cost.
 */
export default function VoronoiNavbarLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const rafRef = useRef(0);

  const stateRef = useRef({ phase: "idle" as Phase, progress: 0, start: 0 });
  const dimsRef = useRef({ w: 0, h: 0, dpr: 1 });
  const seedsRef = useRef<number[]>([]);
  const polysRef = useRef<Array<Array<[number, number]>>>([]);
  const radiiRef = useRef<number[]>([]);
  const strokeRef = useRef("rgba(71,85,105,0.15)");

  /* ── canvas sizing ─────────────────────────────────────────────────────── */

  const resize = useCallback(() => {
    const el = linkRef.current;
    const canvas = canvasRef.current;
    if (!el || !canvas) return false;

    const { width: w, height: h } = el.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    if (w <= 0 || h <= 0) return false;

    const dims = dimsRef.current;
    if (dims.w === w && dims.h === h && dims.dpr === dpr) return false;

    dimsRef.current = { w, h, dpr };
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    return true;
  }, []);

  /* ── geometry ──────────────────────────────────────────────────────────── */

  const buildMesh = useCallback((): boolean => {
    const { w, h } = dimsRef.current;
    if (w <= 0 || h <= 0) return false;

    // Random points can land on top of each other and make Delaunay throw.
    for (let attempt = 0; attempt < 3; attempt++) {
      const seeds: number[] = [];
      for (let i = 0; i < NUM_SEEDS; i++) {
        seeds.push(
          INSET + Math.random() * (w - 2 * INSET),
          INSET + Math.random() * (h - 2 * INSET)
        );
      }

      try {
        const voronoi = new Delaunay(seeds).voronoi([0, 0, w, h]);
        const polys: Array<Array<[number, number]>> = [];
        const radii: number[] = [];

        for (let i = 0; i < NUM_SEEDS; i++) {
          const cell = voronoi.cellPolygon(i);
          if (!cell) {
            polys.push([]);
            radii.push(0);
            continue;
          }

          const poly = cell.map(([x, y]) => [x, y] as [number, number]);
          poly.push([cell[0][0], cell[0][1]]); // close the ring

          // Reveal radius: far enough to uncover the whole cell from its seed.
          const sx = seeds[i * 2];
          const sy = seeds[i * 2 + 1];
          let maxDist = 0;
          for (const [vx, vy] of poly) {
            maxDist = Math.max(maxDist, Math.hypot(vx - sx, vy - sy));
          }

          polys.push(poly);
          radii.push(maxDist + 2);
        }

        seedsRef.current = seeds;
        polysRef.current = polys;
        radiiRef.current = radii;
        return true;
      } catch {
        // Degenerate point set — reroll.
      }
    }
    return false;
  }, []);

  /* ── painting ──────────────────────────────────────────────────────────── */

  const paint = useCallback((progress: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Cached: getContext on every frame is surprisingly expensive.
    const ctx = (ctxRef.current ??= canvas.getContext("2d"));
    if (!ctx) return;

    const { w, h, dpr } = dimsRef.current;
    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    if (progress > 0) {
      ctx.strokeStyle = strokeRef.current;
      ctx.lineWidth = LINE_WIDTH;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const polys = polysRef.current;
      const seeds = seedsRef.current;
      const radii = radiiRef.current;

      for (let i = 0; i < polys.length; i++) {
        const poly = polys[i];
        if (poly.length < 3) continue;

        // Each cell is revealed by a circle expanding from its own seed.
        ctx.save();
        ctx.beginPath();
        ctx.arc(seeds[i * 2], seeds[i * 2 + 1], radii[i] * progress, 0, Math.PI * 2);
        ctx.clip();

        ctx.beginPath();
        ctx.moveTo(poly[0][0], poly[0][1]);
        for (let j = 1; j < poly.length; j++) ctx.lineTo(poly[j][0], poly[j][1]);
        ctx.stroke();
        ctx.restore();
      }
    }

    ctx.restore();
  }, []);

  /* ── animation loop — only alive while enter/leave is in flight ─────────── */

  const stop = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
  }, []);

  const tick = useCallback(
    (ts: number) => {
      const st = stateRef.current;

      if (st.phase === "enter") {
        st.progress = ease(Math.min(1, (ts - st.start) / ENTER_MS));
        paint(st.progress);
        if (st.progress >= 1) {
          st.phase = "complete";
          rafRef.current = 0;
          return; // static from here — nothing left to animate
        }
      } else if (st.phase === "leave") {
        st.progress = Math.max(0, st.progress - (ts - st.start) / LEAVE_MS);
        st.start = ts;
        paint(st.progress);
        if (st.progress <= 0) {
          st.phase = "idle";
          rafRef.current = 0;
          return;
        }
      } else {
        rafRef.current = 0;
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    },
    [paint]
  );

  const start = useCallback(() => {
    if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  /* ── pointer handling ──────────────────────────────────────────────────── */

  const handleEnter = useCallback(() => {
    const el = linkRef.current;
    if (!el) return;

    resize();

    // Re-read the mesh colour each hover so a theme switch is picked up without
    // subscribing every link in the navbar to a React context.
    const mesh = getComputedStyle(el).getPropertyValue("--mesh").trim();
    if (mesh) strokeRef.current = `rgba(${mesh.replace(/\s+/g, ",")},${LINE_ALPHA})`;

    if (!buildMesh()) return;

    const st = stateRef.current;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      st.phase = "complete";
      st.progress = 1;
      paint(1);
      return;
    }

    st.phase = "enter";
    // Resume from wherever a fade-out left off instead of snapping back to 0.
    st.start = performance.now() - easeInverse(st.progress) * ENTER_MS;
    start();
  }, [resize, buildMesh, paint, start]);

  const handleLeave = useCallback(() => {
    const st = stateRef.current;
    if (st.progress <= 0) {
      st.phase = "idle";
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      st.phase = "idle";
      st.progress = 0;
      paint(0);
      return;
    }

    st.phase = "leave";
    st.start = performance.now();
    start();
  }, [paint, start]);

  /* ── lifecycle ─────────────────────────────────────────────────────────── */

  useEffect(() => {
    const el = linkRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => {
      // The backing store is cleared by a resize, so redraw whatever is showing.
      if (!resize()) return;
      ctxRef.current = null;
      const st = stateRef.current;
      if (st.progress > 0 && buildMesh()) paint(st.progress);
    });
    observer.observe(el);

    return () => {
      observer.disconnect();
      stop();
    };
  }, [resize, buildMesh, paint, stop]);

  return (
    <Link
      href={href}
      ref={linkRef}
      onPointerEnter={handleEnter}
      onPointerLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
      className={cn(
        "relative inline-flex items-center rounded-lg px-3 py-5 text-sm",
        "text-fg-muted transition-colors hover:text-brand",
        className
      )}
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden="true"
      />
      <span className="relative z-10">{children}</span>
    </Link>
  );
}
