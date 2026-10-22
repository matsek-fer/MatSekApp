"use client";

import type { DocumentBlock } from "@/types";

/**
 * Markdown and plain text, rendered from the server's blocks.
 *
 * The Markdown is deliberately NOT parsed here. Slice 4 brings a constrained
 * renderer with an allowlist, and until it exists the honest thing is to show
 * the source: a member reading their own notes still gets the text, and no
 * untrusted document gets to inject markup into the page in the meantime.
 *
 * Every block is one element carrying `data-block-id`, so a DOM Range becomes
 * an anchor by walking up to the nearest `[data-block-id]` and taking the
 * offset within it. `data-block-offset` is 0 because a block is exactly one
 * element here; it is written out anyway so the reader and the PDF reader
 * present the same contract to the selection code in slice 3.
 */
export default function TextReader({ blocks }: { blocks: DocumentBlock[] }) {
  return (
    <article className="mx-auto max-w-2xl space-y-4 py-4">
      {blocks.map((block) => (
        <p
          key={block.id}
          data-block-id={block.id}
          data-block-offset={0}
          className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-fg"
        >
          {block.text}
        </p>
      ))}
    </article>
  );
}
