"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { groupIntoLines } from "@/lib/documents/lines";
import type { DocumentBlock } from "@/types";

/**
 * The PDF reading view: a canvas per page, with a transparent text layer on
 * top so the browser's own selection works over faithfully rendered pages.
 *
 * Why not render the extracted text as paragraphs instead? Because this is a
 * mathematics section. Text extraction loses layout, reflows multi-column
 * notes into nonsense, and turns displayed equations into scrambled glyph
 * runs. Drawing the page as the PDF specifies it, and putting invisible text
 * over it, is the only way to get a readable document AND real selection.
 *
 * What it does not fix: the text handed to the model later is still the PDF's
 * glyph sequence. No library recovers `\int_0^\infty` from a file that never
 * embedded it. Rendering is faithful; extraction is approximate.
 *
 * ── The text layer, and why it is ours rather than pdf.js's ────────────────
 *
 * pdf.js ships a TextLayer that positions one span per text item. We build
 * one span per LINE instead, because a line is what the server stored as a
 * block, and a span that is exactly one block is what lets a DOM Range become
 * an anchor by reading `data-block-id` off the nearest ancestor and using the
 * offset within it unchanged.
 *
 * The cost is that a line's glyph positions are approximated by stretching
 * one span across the line's measured width rather than placing each run
 * individually, so a selection highlight can sit a pixel or two off the
 * glyphs under it on a line that changes font mid-way. The alternative —
 * per-item spans — buys that precision back and pays for it by making every
 * anchor a text-matching problem. Correct citations are worth more than
 * perfectly aligned highlights.
 */

interface PdfReaderProps {
  fileUrl: string;
  /** The server's blocks, in document order. The anchor targets. */
  blocks: DocumentBlock[];
}

const ZOOM_LEVELS = [0.75, 1, 1.25, 1.5, 2];
const DEFAULT_ZOOM_INDEX = 1;

/** Pages this far outside the viewport are drawn ahead of being scrolled to. */
const PRERENDER_MARGIN = "200% 0px";

type PdfjsModule = typeof import("pdfjs-dist");
type PdfDocument = Awaited<ReturnType<PdfjsModule["getDocument"]>["promise"]>;

export default function PdfReader({ fileUrl, blocks }: PdfReaderProps) {
  const [pdfjs, setPdfjs] = useState<PdfjsModule | null>(null);
  const [doc, setDoc] = useState<PdfDocument | null>(null);
  const [error, setError] = useState("");
  const [zoomIndex, setZoomIndex] = useState(DEFAULT_ZOOM_INDEX);

  const scale = ZOOM_LEVELS[zoomIndex];

  // Blocks arrive flat; the reader needs them page by page, in order, so a
  // page can be handed exactly the blocks that belong to it.
  const blocksByPage = useRef<Map<number, DocumentBlock[]>>(new Map());
  if (blocksByPage.current.size === 0 && blocks.length > 0) {
    for (const block of blocks) {
      const list = blocksByPage.current.get(block.page) ?? [];
      list.push(block);
      blocksByPage.current.set(block.page, list);
    }
  }

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const pdfjsModule = await import("pdfjs-dist");

        // Served as a static file rather than imported: the worker is an ES
        // module and Next's compiler will not parse `import.meta` inside the
        // bundle. scripts/copy-pdf-worker.mjs puts it here on every dev and
        // build, from the same node_modules this library came from.
        pdfjsModule.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

        if (cancelled) return;
        setPdfjs(pdfjsModule);

        const loaded = await pdfjsModule.getDocument({ url: fileUrl }).promise;
        if (cancelled) {
          await loaded.cleanup();
          return;
        }
        setDoc(loaded);
      } catch (err) {
        console.error("PDF load error:", err);
        if (!cancelled) setError("Dokument nije moguće prikazati.");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [fileUrl]);

  if (error) {
    return (
      <p className="rounded-lg border border-danger/30 bg-danger-bg px-3 py-2.5 text-sm text-danger-fg">
        {error}
      </p>
    );
  }

  if (!doc || !pdfjs) {
    return <p className="text-sm text-fg-muted">Učitavam dokument…</p>;
  }

  return (
    <div className="space-y-4">
      <div className="sticky top-0 z-10 flex items-center gap-2 bg-bg/90 py-2 backdrop-blur">
        <button
          type="button"
          onClick={() => setZoomIndex((i) => Math.max(0, i - 1))}
          disabled={zoomIndex === 0}
          className="rounded-md border border-border px-2 py-1 text-sm text-fg-muted hover:bg-surface-hover disabled:opacity-40"
          aria-label="Smanji"
        >
          −
        </button>
        <span className="min-w-[4ch] text-center text-sm tabular-nums text-fg-muted">
          {Math.round(scale * 100)}%
        </span>
        <button
          type="button"
          onClick={() =>
            setZoomIndex((i) => Math.min(ZOOM_LEVELS.length - 1, i + 1))
          }
          disabled={zoomIndex === ZOOM_LEVELS.length - 1}
          className="rounded-md border border-border px-2 py-1 text-sm text-fg-muted hover:bg-surface-hover disabled:opacity-40"
          aria-label="Povećaj"
        >
          +
        </button>
      </div>

      {Array.from({ length: doc.numPages }, (_, i) => i + 1).map((pageNumber) => (
        <PdfPage
          key={pageNumber}
          pdfjs={pdfjs}
          doc={doc}
          pageNumber={pageNumber}
          scale={scale}
          blocks={blocksByPage.current.get(pageNumber) ?? []}
        />
      ))}
    </div>
  );
}

interface PdfPageProps {
  pdfjs: PdfjsModule;
  doc: PdfDocument;
  pageNumber: number;
  scale: number;
  blocks: DocumentBlock[];
}

interface LineBox {
  blockId: string;
  text: string;
  left: number;
  top: number;
  width: number;
  height: number;
}

/**
 * One page. Nothing is drawn until it comes near the viewport — a 300-page
 * PDF rendered eagerly would allocate 300 canvases the size of the window.
 */
function PdfPage({ pdfjs, doc, pageNumber, scale, blocks }: PdfPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(false);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  const [lines, setLines] = useState<LineBox[]>([]);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setVisible(true);
      },
      { rootMargin: PRERENDER_MARGIN }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const render = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const page = await doc.getPage(pageNumber);
    const viewport = page.getViewport({ scale });

    // Draw at device resolution, lay out at CSS pixels — otherwise the page
    // is soft on every screen that is not exactly 1×.
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.floor(viewport.width * ratio);
    canvas.height = Math.floor(viewport.height * ratio);
    setSize({ width: viewport.width, height: viewport.height });

    await page.render({
      canvas,
      viewport,
      // Scales the drawing up to the backing store; the CSS width above keeps
      // the page the same size on screen. v6 takes the canvas itself rather
      // than a 2D context — `canvasContext` is the deprecated spelling.
      transform: ratio === 1 ? undefined : [ratio, 0, 0, ratio, 0, 0],
    }).promise;

    const content = await page.getTextContent();
    setLines(buildLineBoxes(pdfjs, content.items, viewport, blocks));
    page.cleanup();
  }, [pdfjs, doc, pageNumber, scale, blocks]);

  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    render().catch((err) => {
      if (!cancelled) console.error(`PDF page ${pageNumber} render error:`, err);
    });
    return () => {
      cancelled = true;
    };
  }, [visible, render, pageNumber]);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-fit border border-border bg-white shadow-sm"
      style={size ? { width: size.width, height: size.height } : undefined}
      data-page={pageNumber}
    >
      <canvas
        ref={canvasRef}
        className="block"
        style={size ? { width: size.width, height: size.height } : undefined}
      />

      {/* The selectable layer. Transparent text, real glyph metrics. */}
      <div className="absolute inset-0 select-text" aria-hidden={false}>
        {lines.map((line) => (
          <span
            key={line.blockId}
            data-block-id={line.blockId}
            data-block-offset={0}
            className="absolute origin-top-left whitespace-pre text-transparent"
            style={{
              left: `${line.left}px`,
              top: `${line.top}px`,
              fontSize: `${line.height}px`,
              // Stretched to the measured width of the line, the same trick
              // pdf.js uses per item, so selection tracks the drawn glyphs.
              width: `${line.width}px`,
            }}
          >
            {line.text}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Positions each of the server's blocks over the page it was extracted from.
 *
 * The pairing is by ORDER, not by text: the browser groups the same items
 * with the same function the server used, so line n here is block n there.
 * When the counts disagree — a document ingested before a change to the
 * grouping — the extra lines are dropped rather than stamped with the wrong
 * block id, which would silently mis-attribute a quote.
 */
function buildLineBoxes(
  pdfjs: PdfjsModule,
  items: unknown[],
  viewport: { transform: number[]; height: number },
  blocks: DocumentBlock[]
): LineBox[] {
  const lines = groupIntoLines(items);
  const boxes: LineBox[] = [];

  for (let i = 0; i < Math.min(lines.length, blocks.length); i++) {
    const line = lines[i];
    const block = blocks[i];
    const first = line.pieces[0];
    const last = line.pieces[line.pieces.length - 1];

    const start = pdfjs.Util.transform(viewport.transform, first.transform);
    const end = pdfjs.Util.transform(viewport.transform, last.transform);

    // The vertical scale of the composed matrix is the rendered font height.
    const height = Math.hypot(start[2], start[3]);
    const scale = height / (first.height || height || 1);
    const width = Math.max(end[4] - start[4] + last.width * scale, 1);

    boxes.push({
      blockId: block.id,
      // The server's text, not the browser's: the two agree by construction,
      // and if they ever drift the stored one is what an anchor resolves to.
      text: block.text,
      left: start[4],
      top: start[5] - height,
      width,
      height,
    });
  }

  return boxes;
}
