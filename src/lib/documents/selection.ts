/**
 * DOM selection → anchor. Client-side, no crypto, no server types.
 *
 * Both readers render one element per block carrying `data-block-id` and
 * `data-block-offset`, stamped from the SERVER's block list. So a Range maps
 * to an anchor by walking each endpoint up to its nearest `[data-block-id]`
 * ancestor and offsetting into it — the ids and offsets the server can then
 * resolve against `document_blocks` without trusting any text from here.
 *
 * The `quote` returned is for the optimistic bubble in the UI and nothing
 * else. The server re-derives the real excerpt itself; if this disagrees
 * with what the anchors resolve to, the server's version wins.
 */

export interface SelectionAnchor {
  fromBlockId: string;
  fromOffset: number;
  toBlockId: string;
  toOffset: number;
  /** Display only — never sent as prompt input. */
  quote: string;
}

interface BlockPoint {
  blockId: string;
  offset: number;
  /** True when the span carries no offset — a PDF span, anchored per line. */
  snapped: boolean;
}

/**
 * Offsets are UTF-16 code units throughout — `Range.startOffset` is one, and
 * a TextReader block holds a single text node, so start/end offsets are
 * already indices into the block's own text, shifted by `data-block-offset`.
 *
 * PDF spans carry NO offset attribute, on purpose: they are pdf.js's
 * per-glyph-run spans, many to a block, and their text is positioned rather
 * than concatenated — a character offset into one of them means nothing in
 * block coordinates. Their endpoints SNAP to the whole block, which is the
 * granularity the chat sends anyway.
 */
function resolvePoint(node: Node, offset: number): BlockPoint | null {
  const element =
    node.nodeType === Node.TEXT_NODE ? node.parentElement : (node as Element);

  const host = element?.closest?.("[data-block-id]");
  if (!host) return null;

  const blockId = host.getAttribute("data-block-id");
  if (!blockId) return null;

  const offsetAttribute = host.getAttribute("data-block-offset");
  if (offsetAttribute === null) {
    return { blockId, offset: 0, snapped: true };
  }

  const base = Number(offsetAttribute);

  // An endpoint on an element node (triple-click selects this way) indexes
  // children, not characters; snap it to the start or end of the block text.
  if (node.nodeType !== Node.TEXT_NODE) {
    const length = host.textContent?.length ?? 0;
    return {
      blockId,
      offset: offset === 0 ? base : base + length,
      snapped: false,
    };
  }

  return { blockId, offset: base + offset, snapped: false };
}

/**
 * Reads the current selection into an anchor, or null when the selection is
 * collapsed, outside the reader, or has an endpoint that no block claims —
 * a selection half in the toolbar is not something to build a citation from.
 *
 * `blockLengths` (block id → text length) is what snapped endpoints resolve
 * against: a snapped `to` means "the whole of that block", and only the
 * caller knows how long the server's block text is.
 */
export function anchorFromSelection(
  selection: Selection | null,
  container: HTMLElement,
  blockLengths?: Map<string, number>
): SelectionAnchor | null {
  if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
    return null;
  }

  const range = selection.getRangeAt(0);
  if (
    !container.contains(range.startContainer) ||
    !container.contains(range.endContainer)
  ) {
    return null;
  }

  // Range endpoints are already in document order, whichever direction the
  // member dragged — the normalization Selection.anchorNode would need.
  const from = resolvePoint(range.startContainer, range.startOffset);
  const to = resolvePoint(range.endContainer, range.endOffset);
  if (!from || !to) return null;

  let toOffset = to.offset;
  if (to.snapped) {
    const length = blockLengths?.get(to.blockId);
    if (length === undefined) return null;
    toOffset = length;
  }

  const quote = selection.toString().replace(/\s+/g, " ").trim();
  if (!quote) return null;

  return {
    fromBlockId: from.blockId,
    // A snapped `from` is already 0 — the start of its block.
    fromOffset: from.offset,
    toBlockId: to.blockId,
    toOffset,
    quote,
  };
}
