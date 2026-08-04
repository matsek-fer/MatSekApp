"use client";

import { useLayoutEffect, useRef } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

/**
 * Assistant output, rendered under constraint.
 *
 * Prompt rules lower the odds of an injection steering the model; this
 * renderer lowers the consequence to zero, and it is the control the feature
 * actually relies on. It is a hand-written tokenizer, not a Markdown library
 * with a sanitiser — an allowlist you can misconfigure — and it supports
 * exactly: paragraphs, **bold**, *italic*, `code`, fenced blocks, "- " list
 * items, and $ / $$ mathematics.
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

// ── Inline parsing ─────────────────────────────────────────────────────────

type Inline =
  | { kind: "text"; text: string }
  | { kind: "bold"; text: string }
  | { kind: "italic"; text: string }
  | { kind: "code"; text: string }
  | { kind: "math"; tex: string; display: boolean };

/**
 * First match wins, earliest position wins. Code before math before bold
 * before italic, so `**` inside a code span stays literal and `*` inside
 * math stays TeX.
 */
const INLINE_PATTERNS: { kind: Inline["kind"]; re: RegExp }[] = [
  { kind: "code", re: /`([^`\n]+)`/ },
  { kind: "math", re: /\$\$([^$]+)\$\$|\$([^$\n]+)\$/ },
  { kind: "bold", re: /\*\*([^*\n]+)\*\*/ },
  { kind: "italic", re: /\*([^*\n]+)\*/ },
];

function parseInline(text: string): Inline[] {
  const out: Inline[] = [];
  let rest = text;

  while (rest.length > 0) {
    let firstIndex = -1;
    let firstMatch: RegExpExecArray | null = null;
    let firstKind: Inline["kind"] = "text";

    for (const { kind, re } of INLINE_PATTERNS) {
      const match = re.exec(rest);
      if (match && (firstIndex === -1 || match.index < firstIndex)) {
        firstIndex = match.index;
        firstMatch = match;
        firstKind = kind;
      }
    }

    if (!firstMatch) {
      out.push({ kind: "text", text: rest });
      break;
    }

    if (firstMatch.index > 0) {
      out.push({ kind: "text", text: rest.slice(0, firstMatch.index) });
    }

    if (firstKind === "math") {
      const display = firstMatch[1] !== undefined;
      out.push({
        kind: "math",
        tex: firstMatch[1] ?? firstMatch[2],
        display,
      });
    } else {
      out.push({ kind: firstKind, text: firstMatch[1] } as Inline);
    }

    rest = rest.slice(firstMatch.index + firstMatch[0].length);
  }

  return out;
}

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
          case "bold":
            return <strong key={i}>{part.text}</strong>;
          case "italic":
            return <em key={i}>{part.text}</em>;
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

// ── Block parsing ──────────────────────────────────────────────────────────

type Block =
  | { kind: "paragraph"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "fence"; code: string };

function parseBlocks(text: string): Block[] {
  const blocks: Block[] = [];
  // Fences first, so nothing inside one is mistaken for structure.
  const segments = text.split(/```[^\n]*\n?/);

  segments.forEach((segment, index) => {
    // Odd segments are inside a fence. A stream can end mid-fence; the open
    // segment still renders as code rather than flashing to prose.
    if (index % 2 === 1) {
      const code = segment.replace(/\n$/, "");
      if (code) blocks.push({ kind: "fence", code });
      return;
    }

    for (const paragraph of segment.split(/\n[ \t]*\n/)) {
      const trimmed = paragraph.trim();
      if (!trimmed) continue;

      const lines = trimmed.split("\n");
      if (lines.every((line) => /^\s*-\s+/.test(line))) {
        blocks.push({
          kind: "list",
          items: lines.map((line) => line.replace(/^\s*-\s+/, "")),
        });
      } else {
        blocks.push({ kind: "paragraph", text: trimmed });
      }
    }
  });

  return blocks;
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
