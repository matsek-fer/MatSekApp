/**
 * Anchors — how a selection in the reader becomes something the server can
 * resolve for itself.
 *
 * The invariant this file exists to keep: THE CLIENT SENDS ANCHORS, NEVER
 * TEXT. A selection travels as a pair of block ids and offsets, and the chat
 * route reads the quoted passage out of `document_blocks`. The browser's own
 * copy of the text is used for the quote bubble in the UI and for nothing
 * else. Without this, anyone could put arbitrary text in the "document" slot
 * of the prompt and the server would have no way to tell it apart from the
 * member's actual lecture notes.
 */

import { createHash } from "node:crypto";
import type { DocumentBlock } from "@/types";

export interface DocumentAnchor {
  fromBlockId: string;
  fromOffset: number;
  toBlockId: string;
  toOffset: number;
  /** The browser's copy. Display only — never trusted, never sent to a model. */
  quote: string;
  /** sha256 of the text the server resolved. Set server-side, at save time. */
  quoteHash: string;
}

/**
 * OFFSETS ARE UTF-16 CODE UNITS — JavaScript string indices, because that is
 * what `Range.startOffset` gives you in the browser.
 *
 * Postgres `substring` counts code *points*, so the two disagree the moment a
 * document contains anything outside the BMP: a `𝔽` in a lecture on fields is
 * one code point and two code units. All slicing therefore happens in JS,
 * here, after the blocks have been SELECTed — never in SQL. One offset
 * semantics, no surrogate-pair drift.
 */
export function resolveExcerpt(
  blocks: DocumentBlock[],
  anchor: DocumentAnchor
): string | null {
  const fromIndex = blocks.findIndex((b) => b.id === anchor.fromBlockId);
  const toIndex = blocks.findIndex((b) => b.id === anchor.toBlockId);

  if (fromIndex === -1 || toIndex === -1) return null;
  if (fromIndex > toIndex) return null;

  const from = blocks[fromIndex];
  const to = blocks[toIndex];

  if (!isOffsetWithin(anchor.fromOffset, from.text)) return null;
  if (!isOffsetWithin(anchor.toOffset, to.text)) return null;

  if (fromIndex === toIndex) {
    if (anchor.toOffset < anchor.fromOffset) return null;
    return from.text.slice(anchor.fromOffset, anchor.toOffset);
  }

  const parts: string[] = [from.text.slice(anchor.fromOffset)];
  for (let i = fromIndex + 1; i < toIndex; i++) parts.push(blocks[i].text);
  parts.push(to.text.slice(0, anchor.toOffset));

  return parts.join("\n");
}

function isOffsetWithin(offset: number, text: string): boolean {
  return Number.isInteger(offset) && offset >= 0 && offset <= text.length;
}

/**
 * Recorded alongside a saved citation so a re-ingested document can be caught.
 * Extraction is not guaranteed stable across pdf.js versions; if the text
 * behind an anchor changes, a mismatched hash lets the UI mark the citation
 * stale rather than quietly pointing the member at different words.
 */
export function hashQuote(text: string): string {
  return createHash("sha256").update(text, "utf8").digest("hex");
}

/**
 * Blocks either side of the selection, for context.
 *
 * A PDF block is a line, so a selected formula on its own is often
 * meaningless without the sentence introducing it. This is also the in-scope
 * half of the mitigation for mangled equations: the model gets the
 * neighbourhood, and the system prompt tells it the notation may be damaged.
 */
export function neighbouringBlocks(
  blocks: DocumentBlock[],
  anchor: DocumentAnchor,
  radius = 1
): { before: string[]; after: string[] } {
  const fromIndex = blocks.findIndex((b) => b.id === anchor.fromBlockId);
  const toIndex = blocks.findIndex((b) => b.id === anchor.toBlockId);

  if (fromIndex === -1 || toIndex === -1) return { before: [], after: [] };

  return {
    before: blocks
      .slice(Math.max(0, fromIndex - radius), fromIndex)
      .map((b) => b.text),
    after: blocks.slice(toIndex + 1, toIndex + 1 + radius).map((b) => b.text),
  };
}

/** Narrowing for an anchor arriving in a request body. */
export function isDocumentAnchor(value: unknown): value is DocumentAnchor {
  if (typeof value !== "object" || value === null) return false;
  const a = value as Record<string, unknown>;
  return (
    typeof a.fromBlockId === "string" &&
    typeof a.toBlockId === "string" &&
    Number.isInteger(a.fromOffset) &&
    Number.isInteger(a.toOffset) &&
    (a.fromOffset as number) >= 0 &&
    (a.toOffset as number) >= 0
  );
}
