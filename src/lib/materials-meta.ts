/**
 * Types and constants for the Materials page that are safe to import from
 * client components (no Node APIs). The loader lives in materials.ts; the
 * user-facing labels live in i18n/materials.ts.
 */

export type Category = "general" | "classical" | "language" | "advanced";

export interface Difficulty {
  min: number;
  max: number;
}

export type FreeStatus = "yes" | "no" | "partial" | "unknown";

export interface Material {
  name: string;
  /** First http(s) URL found in the Link field, if any. */
  link: string | null;
  /** Raw Link field (may hold several links or a "pending" note). */
  linkText: string;
  type: string;
  difficulty: Difficulty | null;
  difficultyText: string;
  free: FreeStatus;
  freeText: string;
  /** Markdown */
  strengths: string;
  /** Markdown */
  weaknesses: string;
}

export interface MaterialGroup {
  /** The `##` heading the entries sit under, e.g. "Materials", "Problem books". */
  title: string;
  /** Markdown that is not part of any `###` entry (intro / outro text). */
  notes: string;
  materials: Material[];
}

export interface TopicSections {
  pitch: string;
  pitchProblems: string;
  prerequisites: string;
  general: string;
  problems: string;
  matsek: string;
}

export interface Topic {
  id: string;
  title: string;
  category: Category;
  tagline: string;
  prerequisites: string[];
  requiredBy: string[];
  status: string;
  aiGenerated: string[];
  sections: TopicSections;
  materialGroups: MaterialGroup[];
  difficulty: Difficulty | null;
  counts: { materials: number; free: number; problems: number };
  order: number;
}

/** Everything the overview needs, and nothing that is heavy. */
export type TopicSummary = Pick<
  Topic,
  | "id"
  | "title"
  | "category"
  | "tagline"
  | "prerequisites"
  | "requiredBy"
  | "aiGenerated"
  | "difficulty"
  | "counts"
  | "order"
> & { levels: number[]; shortTitle: string };

/** Title before the first " — ", ": " or " (" — for chips and map labels. */
export function shortTitle(title: string): string {
  return title.split(/ — | – |: | \(/)[0].trim();
}

export const CATEGORY_ORDER: Category[] = ["classical", "language", "advanced"];

/** The overview's views; `?view=` on /materials opens one of the maps. */
export type View = "grid" | "map" | "connections";
export const VIEWS: readonly View[] = ["grid", "map", "connections"];

/** How much two topics trade: 1 touching, 2 regular traffic, 3 inseparable. */
export type Strength = 1 | 2 | 3;

/** One edge of the connections map, as the client components see it. */
export interface ConnectionSummary {
  /** The two topic ids, alphabetical. */
  a: string;
  b: string;
  /** `${a}--${b}`: the file name and the route segment. */
  pair: string;
  tagline: string;
  strength: Strength;
  aiGenerated: boolean;
}

export interface Connection extends ConnectionSummary {
  status: string;
  /** Markdown */
  body: string;
}

/** The pair key of two topic ids, whichever order they come in. */
export function pairId(a: string, b: string): string {
  return [a, b].sort().join("--");
}

/** "2" or "2–4": the language-neutral part of every difficulty badge. */
export function difficultyRange(d: Difficulty): string {
  return d.min === d.max ? `${d.min}` : `${d.min}–${d.max}`;
}
