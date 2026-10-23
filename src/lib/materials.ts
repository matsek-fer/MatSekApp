import fs from "fs";
import path from "path";
import matter from "gray-matter";
import {
  CATEGORY_ORDER,
  type Category,
  type Difficulty,
  type FreeStatus,
  type Material,
  type MaterialGroup,
  type Topic,
  type TopicSections,
  type TopicSummary,
  shortTitle,
} from "./materials-meta";

export * from "./materials-meta";

/**
 * Loader for the Materials page.
 *
 * Source of truth: content/materials/**.md (schema in content/materials/README.md).
 * Everything here runs on the server at request time; the result is plain
 * data so it can be handed to client components.
 */

const CONTENT_DIR = path.join(process.cwd(), "content", "materials");

const SECTION_KEYS: Record<string, keyof TopicSections> = {
  pitch: "pitch",
  "pitch problems": "pitchProblems",
  prerequisites: "prerequisites",
  "from the general materials": "general",
  problems: "problems",
  "matsek materials": "matsek",
};

// ── Parsing helpers ──────────────────────────────────────────────────────

function parseDifficulty(text: string): Difficulty | null {
  const m = text.match(/(\d)\s*(?:[-–]\s*(\d))?/);
  if (!m) return null;
  const min = Number(m[1]);
  const max = m[2] ? Number(m[2]) : min;
  return { min: Math.min(min, max), max: Math.max(min, max) };
}

function parseFree(text: string): FreeStatus {
  const t = text.trim().toLowerCase();
  if (t.startsWith("yes")) return "yes";
  if (t.startsWith("no")) return "no";
  if (t.startsWith("partial")) return "partial";
  if (t.includes("yes") && t.includes("no")) return "partial";
  if (t.includes("yes")) return "yes";
  if (t.includes("no")) return "no";
  return "unknown";
}

/**
 * First http(s) URL in the field, or a root-relative path: hosted files
 * (the topology script) live under public/materials/<topic>/ and are
 * linked as `/materials/topology/predavanje-1.pdf`.
 */
function firstUrl(text: string): string | null {
  const m = text.match(/https?:\/\/[^\s)\]>]+|(?:^|\s)\/[^\s)\]>]+/);
  return m ? m[0].trim() : null;
}

/** Drop the AI-generated note blockquote that opens flagged sections. */
function stripAiNote(md: string): string {
  return md
    .split("\n")
    .filter((line) => !/^>\s*_AI-generated/.test(line))
    .join("\n")
    .trim();
}

/**
 * Parse one `###` material entry. Fields are `- **Name:** value` bullets;
 * a field's value continues on following lines that are indented and do
 * not start a new bullet.
 */
function parseMaterial(name: string, lines: string[]): Material {
  const fields: Record<string, string> = {};
  let current: string | null = null;
  for (const raw of lines) {
    const m = raw.match(/^-\s+\*\*([^*]+):\*\*\s*(.*)$/);
    if (m) {
      current = m[1].trim().toLowerCase();
      fields[current] = m[2].trim();
    } else if (current && raw.trim() !== "") {
      fields[current] = (fields[current] + " " + raw.trim()).trim();
    } else if (raw.trim() === "") {
      current = null;
    }
  }
  const linkText = fields["link"] ?? "";
  const difficultyText = fields["difficulty"] ?? "";
  const freeText = fields["free"] ?? "";
  return {
    name,
    link: firstUrl(linkText),
    linkText,
    type: (fields["type"] ?? "").toLowerCase(),
    difficulty: parseDifficulty(difficultyText),
    difficultyText,
    free: parseFree(freeText),
    freeText,
    strengths: fields["strengths"] ?? "",
    weaknesses: fields["weaknesses"] ?? "",
  };
}

interface ParsedBody {
  sections: TopicSections;
  groups: MaterialGroup[];
}

/**
 * Split the markdown body into the fixed prose sections and the material
 * groups. Any `##` section that contains `###` entries with a Link field is
 * treated as a group of materials, whatever its heading says.
 */
function parseBody(body: string): ParsedBody {
  const sections: TopicSections = {
    pitch: "",
    pitchProblems: "",
    prerequisites: "",
    general: "",
    problems: "",
    matsek: "",
  };
  const groups: MaterialGroup[] = [];

  const lines = body.split("\n");
  let h2: string | null = null;
  let h2Lines: string[] = [];
  let h3: string | null = null;
  let h3Lines: string[] = [];
  let group: MaterialGroup | null = null;

  const flushH3 = () => {
    if (h3 !== null && group) {
      const hasLink = h3Lines.some((l) => /^-\s+\*\*Link:\*\*/.test(l));
      if (hasLink) {
        group.materials.push(parseMaterial(h3, h3Lines));
      } else {
        // A `###` without a Link field is prose; keep it in the notes.
        group.notes += `\n\n**${h3}**\n\n${h3Lines.join("\n")}`;
      }
    }
    h3 = null;
    h3Lines = [];
  };

  const flushH2 = () => {
    flushH3();
    if (h2 === null) return;
    const key = SECTION_KEYS[h2.toLowerCase()];
    if (group && group.materials.length > 0) {
      group.notes = stripAiNote(group.notes);
      groups.push(group);
    } else if (key) {
      sections[key] = stripAiNote(h2Lines.join("\n"));
    } else if (group) {
      // A `##` with no entries and no known key: treat as prose attached to
      // the "problems" section so nothing is silently lost.
      sections.problems = [sections.problems, `### ${h2}`, group.notes]
        .filter(Boolean)
        .join("\n\n")
        .trim();
    }
    h2 = null;
    h2Lines = [];
    group = null;
  };

  for (const line of lines) {
    const m2 = line.match(/^##\s+(.*)$/);
    const m3 = line.match(/^###\s+(.*)$/);
    if (m2) {
      flushH2();
      h2 = m2[1].trim();
      group = { title: h2, notes: "", materials: [] };
      continue;
    }
    if (m3 && h2 !== null) {
      flushH3();
      h3 = m3[1].trim();
      continue;
    }
    if (h3 !== null) {
      h3Lines.push(line);
    } else if (h2 !== null) {
      h2Lines.push(line);
      if (group) group.notes += (group.notes ? "\n" : "") + line;
    }
  }
  flushH2();

  return { sections, groups };
}

// ── Loading ──────────────────────────────────────────────────────────────

function readmeOrder(): Map<string, number> {
  const order = new Map<string, number>();
  try {
    const readme = fs.readFileSync(path.join(CONTENT_DIR, "README.md"), "utf8");
    const list = readme.split("## Master topic list")[1] ?? "";
    let i = 0;
    for (const line of list.split("\n")) {
      const m = line.match(/^- [☐◐●] `([a-z0-9-]+)`/);
      if (m) order.set(m[1], i++);
    }
  } catch {
    // no README: fall back to alphabetical
  }
  return order;
}

function listTopicFiles(): string[] {
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith(".md") && entry.name !== "README.md")
        out.push(full);
    }
  };
  walk(CONTENT_DIR);
  return out;
}

function asStringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String);
  if (typeof v === "string" && v.trim()) return [v.trim()];
  return [];
}

let cache: Topic[] | null = null;

export function getAllTopics(): Topic[] {
  if (cache && process.env.NODE_ENV === "production") return cache;

  const order = readmeOrder();
  const topics: Topic[] = listTopicFiles().map((file) => {
    const raw = fs.readFileSync(file, "utf8");
    const { data, content } = matter(raw);
    const { sections, groups } = parseBody(content);

    const materials = groups.flatMap((g) => g.materials);
    const withDifficulty = materials.filter((m) => m.difficulty);
    const difficulty: Difficulty | null = withDifficulty.length
      ? {
          min: Math.min(...withDifficulty.map((m) => m.difficulty!.min)),
          max: Math.max(...withDifficulty.map((m) => m.difficulty!.max)),
        }
      : null;
    const problems = (sections.pitchProblems.match(/^\d+\.\s+\*\*/gm) ?? [])
      .length;

    const id = String(data.id ?? path.basename(file, ".md"));
    return {
      id,
      title: String(data.title ?? id),
      category: (data.category as Category) ?? "classical",
      tagline: String(data.tagline ?? ""),
      prerequisites: asStringArray(data.prerequisites),
      requiredBy: [],
      status: String(data.status ?? "draft"),
      aiGenerated: asStringArray(data.ai_generated),
      sections,
      materialGroups: groups,
      difficulty,
      counts: {
        materials: materials.length,
        free: materials.filter((m) => m.free === "yes").length,
        problems,
      },
      order: order.get(id) ?? 1000,
    };
  });

  const ids = new Set(topics.map((t) => t.id));
  for (const t of topics) {
    t.requiredBy = topics
      .filter((o) => o.prerequisites.includes(t.id))
      .map((o) => o.id);
    t.prerequisites = t.prerequisites.filter((p) => ids.has(p));
  }

  topics.sort((a, b) => {
    const ca = CATEGORY_ORDER.indexOf(a.category);
    const cb = CATEGORY_ORDER.indexOf(b.category);
    if (ca !== cb) return ca - cb;
    if (a.order !== b.order) return a.order - b.order;
    return a.title.localeCompare(b.title);
  });

  cache = topics;
  return topics;
}

export function getTopic(id: string): Topic | undefined {
  return getAllTopics().find((t) => t.id === id);
}

export function toSummary(t: Topic): TopicSummary {
  const levels: number[] = [];
  for (const g of t.materialGroups)
    for (const m of g.materials)
      if (m.difficulty)
        for (let l = m.difficulty.min; l <= m.difficulty.max; l++)
          if (!levels.includes(l)) levels.push(l);
  levels.sort();
  return {
    id: t.id,
    title: t.title,
    category: t.category,
    tagline: t.tagline,
    prerequisites: t.prerequisites,
    requiredBy: t.requiredBy,
    aiGenerated: t.aiGenerated,
    difficulty: t.difficulty,
    counts: t.counts,
    order: t.order,
    levels,
    shortTitle: shortTitle(t.title),
  };
}

export function getTopicTitles(): Record<string, string> {
  return Object.fromEntries(getAllTopics().map((t) => [t.id, t.title]));
}

/** Short titles (before the dash) for chips and map labels. */
export function getTopicShortTitles(): Record<string, string> {
  return Object.fromEntries(
    getAllTopics().map((t) => [t.id, shortTitle(t.title)])
  );
}
