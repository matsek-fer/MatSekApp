"use client";

import { useLayoutEffect, useRef } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import {
  parseBlocks,
  parseInline,
  type Inline,
} from "@/lib/documents/assistant-markup";

/**
 * Assistant output, rendered under constraint.
 *
 * Prompt rules lower the odds of an injection steering the model; this
 * renderer lowers the consequence to zero, and it is the control the feature
 * actually relies on. The tokenizer lives in lib/documents/assistant-markup
 * (pure, testable headless); this file only turns its output into elements.
 *
 * Deliberately absent, not sanitised — absent:
 *   - Links. A URL renders as literal text the member can copy. This kills
 *     the disguised-link channel.
 *   - Images. There is no way to emit one, which kills the markdown-image
 *     auto-fetch channel — the no-click one — outright.
 *   - HTML. Everything unrecognised is literal text via React's escaping.
 *
 * Math goes through KaTeX with `trust: false`, which is what disables \href
 * and \url inside formulas. It is the default; it is passed explicitly so
 * nobody deletes it as redundant. KaTeX writes into an element ref rather
 * than through dangerouslySetInnerHTML — its output is generated from TeX
 * source, but the convention in this feature is that no JSX injects HTML,
 * and conventions survive better without exceptions.
 */

/** KaTeX renders into a ref — see the header for why not innerHTML in JSX. */
function Math({ tex, display }: { tex: string; display: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    if (!ref.current) return;
    katex.render(tex, ref.current, {
      throwOnError: false,
      trust: false,
      strict: "warn",
      displayMode: display,
    });
  }, [tex, display]);

  return <span ref={ref} />;
}

function InlineRun({ parts }: { parts: Inline[] }) {
  return (
    <>
      {parts.map((part, i) => {
        switch (part.kind) {
          // Emphasis content is re-parsed: models routinely bold a heading
          // that contains math, and emitting it as plain text was exactly
          // how raw $\delta_i$ reached the screen. Recursion terminates
          // because the emphasis patterns exclude their own markers.
          case "bold":
            return (
              <strong key={i}>
                <InlineRun parts={parseInline(part.text)} />
              </strong>
            );
          case "italic":
            return (
              <em key={i}>
                <InlineRun parts={parseInline(part.text)} />
              </em>
            );
          case "code":
            return (
              <code
                key={i}
                className="rounded bg-surface-hover px-1 py-0.5 font-mono text-[0.9em]"
              >
                {part.text}
              </code>
            );
          case "math":
            return <Math key={i} tex={part.tex} display={part.display} />;
          default:
            return <span key={i}>{part.text}</span>;
        }
      })}
    </>
  );
}

export default function AssistantText({ text }: { text: string }) {
  const blocks = parseBlocks(text);

  return (
    <div className="space-y-3 text-sm leading-relaxed text-fg">
      {blocks.map((block, i) => {
        switch (block.kind) {
          case "fence":
            return (
              <pre
                key={i}
                className="overflow-x-auto rounded-lg bg-surface-hover p-3 font-mono text-xs"
              >
                {block.code}
              </pre>
            );
          case "list":
            return (
              <ul key={i} className="list-disc space-y-1 pl-5">
                {block.items.map((item, j) => (
                  <li key={j}>
                    <InlineRun parts={parseInline(item)} />
                  </li>
                ))}
              </ul>
            );
          default:
            return (
              <p key={i} className="whitespace-pre-wrap">
                <InlineRun parts={parseInline(block.text)} />
              </p>
            );
        }
      })}
    </div>
  );
}
