/**
 * Chunking — turning blocks into retrieval passages.
 *
 * Blocks are the render and anchor unit (a paragraph, or a PDF line), which
 * makes them too small to search: one line of a proof carries no meaning
 * without its neighbours. A chunk is a run of consecutive blocks from ONE
 * page, aimed at ~700 characters, with one block of overlap between
 * neighbours so a sentence cut at a boundary still appears whole somewhere.
 *
 * The block-index range is kept on every chunk so a retrieved passage can be
 * traced back to its exact place in the reader — the same philosophy as
 * anchors: a chunk is a REFERENCE to part of the document, not loose text.
 */

import type { ExtractedBlock } from "@/lib/documents/extract";

/** Aim, not a hard cap: a chunk closes once it crosses this. */
const TARGET_CHUNK_CHARS = 700;

/** A single block longer than this stands alone rather than dragging
 * neighbours into an oversized passage. */
const MAX_CHUNK_CHARS = 1_400;

export interface DocumentChunkDraft {
  chunkIndex: number;
  page: number;
  fromBlockIndex: number;
  toBlockIndex: number;
  text: string;
}

export function chunkBlocks(blocks: ExtractedBlock[]): DocumentChunkDraft[] {
  const chunks: DocumentChunkDraft[] = [];

  let run: { text: string; index: number }[] = [];
  let runPage = 0;
  let runChars = 0;

  const flush = () => {
    if (!run.length) return;
    chunks.push({
      chunkIndex: chunks.length,
      page: runPage,
      fromBlockIndex: run[0].index,
      toBlockIndex: run[run.length - 1].index,
      text: run.map((b) => b.text).join("\n"),
    });
  };

  blocks.forEach((block, index) => {
    const startsNewPage = run.length > 0 && block.page !== runPage;
    const wouldOverflow =
      runChars + block.text.length > MAX_CHUNK_CHARS && run.length > 0;

    if (startsNewPage || wouldOverflow) {
      flush();
      // One block of overlap, but never across a page boundary — a passage
      // that straddles pages would carry a page number that is half wrong.
      const carry =
        !startsNewPage && run.length > 0 ? run[run.length - 1] : null;
      run = carry ? [carry] : [];
      runChars = carry ? carry.text.length : 0;
    }

    if (run.length === 0) runPage = block.page;
    run.push({ text: block.text, index });
    runChars += block.text.length;

    if (runChars >= TARGET_CHUNK_CHARS) {
      flush();
      const last = run[run.length - 1];
      run = [last];
      runChars = last.text.length;
      runPage = block.page;
    }
  });

  // The trailing run: flush unless it is exactly the overlap block of an
  // already-flushed chunk, which would duplicate it as its own passage.
  if (
    run.length > 1 ||
    (run.length === 1 &&
      (chunks.length === 0 ||
        chunks[chunks.length - 1].toBlockIndex !== run[0].index))
  ) {
    flush();
  }

  return chunks;
}
