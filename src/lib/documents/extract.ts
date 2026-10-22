/**
 * Turning an uploaded file into blocks.
 *
 * A block is the unit the reader renders and the unit an anchor points at, so
 * what this file decides is what a member can select and quote. Both come out
 * of here rather than out of the browser: the reader draws the server's blocks
 * so that a citation is a pair of ids and offsets the server can resolve for
 * itself, never text the client hands it. See lib/documents/anchors.ts.
 *
 * This runs in a route handler, not a job queue — the project has no
 * precedent for one. That is why every loop below is bounded.
 */

import { join } from "node:path";
import { groupIntoLines } from "@/lib/documents/lines";
import {
  MAX_DOCUMENT_BLOCKS,
  MAX_DOCUMENT_PAGES,
} from "@/lib/validation";
import type { DocumentKind } from "@/types";

export interface ExtractedBlock {
  page: number;
  text: string;
}

export interface ExtractResult {
  blocks: ExtractedBlock[];
  pageCount: number;
  /** True when a cap cut the document short; the reader says so. */
  truncated: boolean;
}

export async function extractDocument(
  bytes: Uint8Array,
  kind: DocumentKind
): Promise<ExtractResult> {
  if (kind === "pdf") return extractPdf(bytes);
  return extractPlainText(bytes, kind === "markdown");
}

// ── Markdown and plain text ────────────────────────────────────────────────

/**
 * Paragraphs, split on blank lines.
 *
 * Markdown headings become blocks of their own even without a blank line
 * after them, because a heading is what a member is most likely to want to
 * ask about by itself — and because a heading swallowed into the paragraph
 * below it makes every offset in that paragraph read as part of the title.
 */
function extractPlainText(bytes: Uint8Array, isMarkdown: boolean): ExtractResult {
  const raw = new TextDecoder("utf-8").decode(bytes).replace(/\r\n?/g, "\n");

  const blocks: ExtractedBlock[] = [];
  let truncated = false;

  for (const paragraph of raw.split(/\n[ \t]*\n/)) {
    const pieces = isMarkdown ? splitLeadingHeadings(paragraph) : [paragraph];

    for (const piece of pieces) {
      const text = piece.trim();
      if (!text) continue;

      if (blocks.length >= MAX_DOCUMENT_BLOCKS) {
        truncated = true;
        break;
      }
      blocks.push({ page: 1, text });
    }

    if (truncated) break;
  }

  return { blocks, pageCount: 1, truncated };
}

function splitLeadingHeadings(paragraph: string): string[] {
  const lines = paragraph.split("\n");
  const out: string[] = [];
  let run: string[] = [];

  const flush = () => {
    if (run.length) out.push(run.join("\n"));
    run = [];
  };

  for (const line of lines) {
    if (/^#{1,6}\s/.test(line.trim())) {
      flush();
      out.push(line);
    } else {
      run.push(line);
    }
  }

  flush();
  return out;
}

// ── PDF ────────────────────────────────────────────────────────────────────

/**
 * pdfjs-dist v6 ships as ESM only, and the legacy build is the one that runs
 * outside a browser. It is imported dynamically, and listed in
 * `serverComponentsExternalPackages`, so Next leaves it alone instead of
 * bundling it and breaking its worker resolution.
 */
async function extractPdf(bytes: Uint8Array): Promise<ExtractResult> {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");

  const task = pdfjs.getDocument({
    data: bytes,
    // An uploaded PDF is untrusted input and nothing here renders it — only
    // its text is wanted — so pdf.js is given no way to fetch anything on the
    // document's behalf. Both of these already default to false under Node;
    // they are written out because that default is environment-dependent.
    // (v4's `isEvalSupported` has no equivalent here: pdf.js v6 dropped
    // eval-based font rendering outright.)
    useSystemFonts: false,
    useWorkerFetch: false,
    standardFontDataUrl: standardFontsDirectory(),
  });

  const doc = await task.promise;

  try {
    const pageCount = doc.numPages;
    const pagesToRead = Math.min(pageCount, MAX_DOCUMENT_PAGES);
    const blocks: ExtractedBlock[] = [];
    let truncated = pagesToRead < pageCount;

    for (let pageNumber = 1; pageNumber <= pagesToRead; pageNumber++) {
      const page = await doc.getPage(pageNumber);
      try {
        const content = await page.getTextContent();
        for (const line of groupIntoLines(content.items)) {
          if (blocks.length >= MAX_DOCUMENT_BLOCKS) {
            truncated = true;
            break;
          }
          blocks.push({ page: pageNumber, text: line.text });
        }
      } finally {
        page.cleanup();
      }

      if (blocks.length >= MAX_DOCUMENT_BLOCKS) break;
    }

    return { blocks, pageCount, truncated };
  } finally {
    // `destroy` is on the loading task, not the document proxy — the proxy has
    // only `cleanup`, and leaving the task alive leaks the worker.
    await task.destroy();
  }
}

/**
 * Without this pdf.js warns once per document that it cannot find its
 * standard font data. The text still comes out, but the warning is noise on
 * every ingest, and a document leaning on the built-in font metrics deserves
 * the real files.
 *
 * The path is assembled by hand rather than through `require.resolve`,
 * because webpack rewrites both `createRequire` and dynamic
 * `import("node:module")` into shims that cannot resolve — the module is in
 * `serverComponentsExternalPackages`, so at runtime it really does sit in the
 * project's own node_modules, which is exactly what this spells out.
 */
function standardFontsDirectory(): string {
  return `${join(process.cwd(), "node_modules", "pdfjs-dist", "standard_fonts")}/`;
}
