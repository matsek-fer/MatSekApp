/**
 * The constrained tokenizer behind AssistantText — pure data in, data out,
 * no React and no CSS, so it can be tested headless.
 *
 * It supports exactly: paragraphs, **bold**, *italic*, `code`, fenced
 * blocks, "- " list items, and mathematics in all four delimiter dialects
 * models actually emit — $, $$, \( \) and \[ \] — because no system prompt
 * has ever talked a model out of its favourite delimiter for long.
 * Everything else renders as literal text; links and images are not
 * sanitised but ABSENT (see AssistantText for why that is the security
 * model).
 */

export type Inline =
  | { kind: "text"; text: string }
  | { kind: "bold"; text: string }
  | { kind: "italic"; text: string }
  | { kind: "code"; text: string }
  | { kind: "math"; tex: string; display: boolean };

export type Block =
  | { kind: "paragraph"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "fence"; code: string };

/**
 * First match wins, earliest position wins. Code before math before bold
 * before italic, so `**` inside a code span stays literal and `*` inside
 * math stays TeX. Math group order: $$…$$, \[…\], $…$, \(…\); the first two
 * are display math.
 */
const INLINE_PATTERNS: { kind: Inline["kind"]; re: RegExp }[] = [
  { kind: "code", re: /`([^`\n]+)`/ },
  {
    kind: "math",
    re: /\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\]|\$([^$\n]+)\$|\\\((.+?)\\\)/,
  },
  { kind: "bold", re: /\*\*([^*\n]+)\*\*/ },
  { kind: "italic", re: /\*([^*\n]+)\*/ },
];

export function parseInline(text: string): Inline[] {
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
      const display =
        firstMatch[1] !== undefined || firstMatch[2] !== undefined;
      out.push({
        kind: "math",
        tex: firstMatch[1] ?? firstMatch[2] ?? firstMatch[3] ?? firstMatch[4],
        display,
      });
    } else {
      out.push({ kind: firstKind, text: firstMatch[1] } as Inline);
    }

    rest = rest.slice(firstMatch.index + firstMatch[0].length);
  }

  return out;
}

export function parseBlocks(text: string): Block[] {
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
