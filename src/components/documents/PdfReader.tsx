"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { groupIntoLines } from "@/lib/documents/lines";
import type { DocumentBlock } from "@/types";

/**
 * The PDF reading view: a canvas per page, with pdf.js's own TextLayer on
 * top so the browser's selection works over faithfully rendered pages.
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
 * ── The text layer ─────────────────────────────────────────────────────────
 *
 * The selection surface is pdf.js's TextLayer — one span per glyph run, the
 * right font, a per-span horizontal scale — the same machinery Firefox's
 * viewer uses. A first version of this file hand-rolled one stretched span
 * per line in the site's font instead, and the result was selection
 * highlights visibly larger than the glyphs and formulas that could not be
 * selected at all. Its CSS lives in globals.css under `.textLayer`.
 *
 * The anchor system rides on top: `TextLayer.textDivs` aligns 1:1 with the
 * raw text items, and the shared grouping in lib/documents/lines.ts records
 * each piece's raw item index, so after render every span is stamped with
 * the id of the server block its line belongs to. PDF spans carry NO
 * data-block-offset — that absence is what tells the selection code to snap
 * the anchor to whole lines, which is the granularity the chat sends anyway.
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

/**
 * One page. Nothing is drawn until it comes near the viewport — a 300-page
 * PDF rendered eagerly would allocate 300 canvases the size of the window.
 */
function PdfPage({ pdfjs, doc, pageNumber, scale, blocks }: PdfPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textLayerRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<InstanceType<PdfjsModule["TextLayer"]> | null>(null);
  const [visible, setVisible] = useState(false);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);

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
    const textLayerHost = textLayerRef.current;
    if (!canvas || !textLayerHost) return;

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

    // A zoom change re-renders; the previous layer must not survive it.
    layerRef.current?.cancel();
    textLayerHost.replaceChildren();

    const layer = new pdfjs.TextLayer({
      textContentSource: content,
      container: textLayerHost,
      viewport,
    });
    layerRef.current = layer;
    await layer.render();

    stampBlockIds(layer.textDivs, content.items, blocks, pageNumber);
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
      layerRef.current?.cancel();
    };
  }, [visible, render, pageNumber]);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-fit border border-border bg-white shadow-sm"
      style={
        {
          ...(size ? { width: size.width, height: size.height } : {}),
          // TextLayer sizes itself and its font metrics from this variable;
          // the full pdf.js viewer sets it on the page div, so we do too.
          "--total-scale-factor": String(scale),
        } as React.CSSProperties
      }
      data-page={pageNumber}
    >
      <canvas
        ref={canvasRef}
        className="block"
        style={size ? { width: size.width, height: size.height } : undefined}
      />

      {/* pdf.js positions its spans in here; styling under .textLayer in
          globals.css. */}
      <div ref={textLayerRef} className="textLayer" />
    </div>
  );
}

/**
 * Writes each server block's id onto the TextLayer spans of its line.
 *
 * `textDivs` is index-aligned with the RAW items array, and every piece the
 * shared grouping produced remembers its raw index — so the pairing is
 * arithmetic, no text matching. Lines and blocks pair by ORDER (line n of
 * this page is block n of this page); when the counts disagree — a document
 * ingested before a grouping change — the extra lines stay unstamped rather
 * than mis-attributed, and selecting them simply offers no anchor.
 */
function stampBlockIds(
  textDivs: HTMLElement[],
  items: unknown[],
  blocks: DocumentBlock[],
  pageNumber: number
) {
  const lines = groupIntoLines(items);

  if (lines.length !== blocks.length) {
    console.warn(
      `PDF page ${pageNumber}: ${lines.length} lines vs ${blocks.length} blocks — stale ingest? Re-run obrada.`
    );
  }

  const count = Math.min(lines.length, blocks.length);
  for (let i = 0; i < count; i++) {
    for (const piece of lines[i].pieces) {
      const span = textDivs[piece.itemIndex];
      if (span) span.dataset.blockId = blocks[i].id;
    }
  }
}
