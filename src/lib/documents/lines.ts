/**
 * Grouping a PDF's text items into lines.
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
 * If you change the grouping, both sides change together and documents
 * ingested before the change keep the old block boundaries — which is what
 * `quoteHash` in anchors.ts exists to notice.
 */

/** The subset of pdf.js's TextItem this code uses. */
export interface TextPiece {
  str: string;
  /** Item transform, [a, b, c, d, e, f]; e and f are x and y in PDF space. */
  transform: number[];
  width: number;
  height: number;
  hasEOL: boolean;
}

export interface TextLine {
  text: string;
  pieces: TextPiece[];
}

/** Two items belong to the same line if their baselines are this close. */
const BASELINE_TOLERANCE_RATIO = 0.5;

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

  for (const item of items) {
    // Marked-content entries have no `str`; they are structure, not text.
    const candidate = item as Partial<TextPiece>;
    if (typeof candidate.str !== "string" || !candidate.transform) continue;
    if (!candidate.str.trim()) continue;

    pieces.push({
      str: candidate.str,
      transform: candidate.transform,
      width: candidate.width ?? 0,
      height: candidate.height ?? 0,
      hasEOL: candidate.hasEOL ?? false,
    });
  }

  // Top to bottom, then left to right. PDF y grows upward, hence the negation.
  pieces.sort(
    (a, b) => b.transform[5] - a.transform[5] || a.transform[4] - b.transform[4]
  );

  const lines: TextLine[] = [];
  let current: TextPiece[] = [];

  const flush = () => {
    if (!current.length) return;
    const text = lineText(current);
    if (text) lines.push({ text, pieces: current });
    current = [];
  };

  for (const piece of pieces) {
    if (current.length) {
      const previous = current[current.length - 1];
      const tolerance =
        Math.max(previous.height, piece.height, 1) * BASELINE_TOLERANCE_RATIO;
      const sameBaseline =
        Math.abs(previous.transform[5] - piece.transform[5]) <= tolerance;

      if (!sameBaseline || previous.hasEOL) flush();
    }
    current.push(piece);
  }

  flush();
  return lines;
}
