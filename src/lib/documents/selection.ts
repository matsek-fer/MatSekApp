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
}

/**
 * Offsets are UTF-16 code units throughout — `Range.startOffset` is one, and
 * the block spans hold a single text node, so start/end offsets are already
 * indices into the block's own text. `data-block-offset` shifts them when a
 * block ever renders as more than one span.
 */
function resolvePoint(node: Node, offset: number): BlockPoint | null {
  const element =
    node.nodeType === Node.TEXT_NODE ? node.parentElement : (node as Element);

  const host = element?.closest?.("[data-block-id]");
  if (!host) return null;

  const blockId = host.getAttribute("data-block-id");
  if (!blockId) return null;

  const base = Number(host.getAttribute("data-block-offset") ?? "0");

  // An endpoint on an element node (triple-click selects this way) indexes
  // children, not characters; snap it to the start or end of the block text.
  if (node.nodeType !== Node.TEXT_NODE) {
    const length = host.textContent?.length ?? 0;
    return { blockId, offset: offset === 0 ? base : base + length };
  }

  return { blockId, offset: base + offset };
}

/**
 * Reads the current selection into an anchor, or null when the selection is
 * collapsed, outside the reader, or has an endpoint that no block claims —
 * a selection half in the toolbar is not something to build a citation from.
 */
export function anchorFromSelection(
  selection: Selection | null,
  container: HTMLElement
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

  const quote = selection.toString().replace(/\s+/g, " ").trim();
  if (!quote) return null;

  return {
    fromBlockId: from.blockId,
    fromOffset: from.offset,
    toBlockId: to.blockId,
    toOffset: to.offset,
    quote,
  };
}
