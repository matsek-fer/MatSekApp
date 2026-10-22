/**
 * Grouping a PDF's text items into lines, in reading order.
 *
 * This module is imported by BOTH the server-side extractor and the reader in
 * the browser, and that is the whole point. A PDF has no paragraphs — it has
 * glyph runs at coordinates — so "what is a line" is a decision, not a fact,
 * and the two sides have to make it identically.
 *
 * They do, because both run this function over the same items: `getTextContent()`
 * on the same bytes through the same pdf.js returns the same array in the same
 * order. So the n-th line of page p in the browser is the n-th line of page p
 * that the server stored as a block, and the reader can stamp a server block
 * id onto a span it rendered itself without any text matching.
 *
 * Three decisions live here:
 *
 *   1. Items on the same baseline (within half the taller item's height)
 *      belong to the same line —
 *   2 — unless a horizontal gap wider than the GUTTER_RATIO says otherwise.
 *      Academic papers are set in two columns, and without this split the
 *      left and right columns of the same baseline would fuse into one
 *      nonsense block that a selection cannot avoid and a model cannot read.
 *   3. Lines are emitted in READING order, not row order: when a page shows
 *      two columns, the left column runs top to bottom before the right one
 *      starts. Browser selection follows DOM order, so this is what makes
 *      dragging down one column select only that column.
 *
 * If you change any of them, both sides change together and documents
 * ingested before the change keep the old block boundaries — re-ingest them
 * (the force path on the ingest route), and `quoteHash` in anchors.ts is
 * what notices citations whose text has shifted.
 */

/** The subset of pdf.js's TextItem this code uses. */
export interface TextPiece {
  str: string;
  /** Item transform, [a, b, c, d, e, f]; e and f are x and y in PDF space. */
  transform: number[];
  width: number;
  height: number;
  hasEOL: boolean;
  /**
   * The piece's index in the RAW getTextContent().items array, before
   * filtering and sorting. pdf.js's TextLayer renders one element per raw
   * item in that same order, so this is how the reader finds the span that
   * belongs to a piece and stamps the block id on it.
   */
  itemIndex: number;
}

export interface TextLine {
  text: string;
  pieces: TextPiece[];
}

/** Two items belong to the same line if their baselines are this close. */
const BASELINE_TOLERANCE_RATIO = 0.5;

/**
 * A horizontal gap wider than this many line-heights splits the line. Word
 * gaps run well under one height; the gutter between two columns runs well
 * over. Tables split at cell boundaries too, which is harmless — a few more
 * blocks, each selectable on its own.
 */
const GUTTER_RATIO = 1.5;

/**
 * How much of a page's lines must sit cleanly in a left or right half before
 * the page is treated as two-column, and the slack allowed around the
 * midline before a line counts as crossing it.
 */
const COLUMN_MAJORITY = 0.5;
const MIDLINE_SLACK_RATIO = 0.06;

interface PositionedLine {
  text: string;
  pieces: TextPiece[];
  x0: number;
  x1: number;
  y: number;
}

/**
 * The one place a line's text is assembled. Both sides must agree on the
 * whitespace exactly, because block offsets are indices into this string.
 */
export function lineText(pieces: TextPiece[]): string {
  return pieces
    .map((p) => p.str)
    .join("")
    .replace(/\s+/g, " ")
    .trim();
}

export function groupIntoLines(items: unknown[]): TextLine[] {
  const pieces: TextPiece[] = [];

  items.forEach((item, itemIndex) => {
    // Marked-content entries have no `str`; they are structure, not text.
    const candidate = item as Partial<TextPiece>;
    if (typeof candidate.str !== "string" || !candidate.transform) return;
    if (!candidate.str.trim()) return;

    pieces.push({
      str: candidate.str,
      transform: candidate.transform,
      width: candidate.width ?? 0,
      height: candidate.height ?? 0,
      hasEOL: candidate.hasEOL ?? false,
      itemIndex,
    });
  });

  // Top to bottom, then left to right. PDF y grows upward, hence the negation.
  pieces.sort(
    (a, b) => b.transform[5] - a.transform[5] || a.transform[4] - b.transform[4]
  );

  const lines: PositionedLine[] = [];
  let current: TextPiece[] = [];

  const flush = () => {
    if (!current.length) return;
    const text = lineText(current);
    if (text) {
      const first = current[0];
      const last = current[current.length - 1];
      lines.push({
        text,
        pieces: current,
        x0: first.transform[4],
        x1: last.transform[4] + last.width,
        y: first.transform[5],
      });
    }
    current = [];
  };

  for (const piece of pieces) {
    if (current.length) {
      const previous = current[current.length - 1];
      const scale = Math.max(previous.height, piece.height, 1);

      const sameBaseline =
        Math.abs(previous.transform[5] - piece.transform[5]) <=
        scale * BASELINE_TOLERANCE_RATIO;

      // The gutter test: same baseline, but too far away to be the same
      // column. This is what keeps two-column papers apart.
      const gap =
        piece.transform[4] - (previous.transform[4] + previous.width);
      const acrossGutter = gap > scale * GUTTER_RATIO;

      if (!sameBaseline || acrossGutter || previous.hasEOL) flush();
    }
    current.push(piece);
  }

  flush();
  return orderForReading(lines).map(({ text, pieces: p }) => ({
    text,
    pieces: p,
  }));
}

/**
 * Row order → reading order.
 *
 * A line is `left` if it ends by the midline, `right` if it starts there,
 * `full` if it crosses it (titles, abstracts, stretched figures). Only when
 * both columns are clearly populated is the page treated as two-column;
 * otherwise the row order stands, so single-column documents are untouched.
 *
 * Full-width lines act as fences: each region between them is emitted left
 * column first, then right. That handles the common shape — full-width title
 * block above two columns — and a full-width figure straddling the middle of
 * a page.
 */
function orderForReading(lines: PositionedLine[]): PositionedLine[] {
  if (lines.length < 4) return lines;

  const x0 = Math.min(...lines.map((l) => l.x0));
  const x1 = Math.max(...lines.map((l) => l.x1));
  const mid = (x0 + x1) / 2;
  const slack = (x1 - x0) * MIDLINE_SLACK_RATIO;

  type Side = "left" | "right" | "full";
  const sideOf = (line: PositionedLine): Side => {
    if (line.x0 < mid - slack && line.x1 > mid + slack) return "full";
    if (line.x1 <= mid + slack) return "left";
    return "right";
  };

  const sides = lines.map(sideOf);
  const leftCount = sides.filter((s) => s === "left").length;
  const rightCount = sides.filter((s) => s === "right").length;

  const isTwoColumn =
    leftCount > 2 &&
    rightCount > 2 &&
    (leftCount + rightCount) / lines.length >= COLUMN_MAJORITY;

  if (!isTwoColumn) return lines;

  const out: PositionedLine[] = [];
  let leftBand: PositionedLine[] = [];
  let rightBand: PositionedLine[] = [];

  const flushBand = () => {
    out.push(...leftBand, ...rightBand);
    leftBand = [];
    rightBand = [];
  };

  lines.forEach((line, i) => {
    if (sides[i] === "full") {
      flushBand();
      out.push(line);
    } else if (sides[i] === "left") {
      leftBand.push(line);
    } else {
      rightBand.push(line);
    }
  });

  flushBand();
  return out;
}
