/**
 * Types and constants for the Materials page that are safe to import from
 * client components (no Node APIs). The loader lives in materials.ts.
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
  order: number;
}

/**
 * Everything the overview needs, and nothing that is heavy. The overview is
 * a list of names to explore one by one: no tagline, no difficulty, no
 * counts — difficulty belongs to a book, not to a field.
 */
export type TopicSummary = Pick<
  Topic,
  "id" | "title" | "category" | "prerequisites" | "requiredBy" | "order"
> & { shortTitle: string };

/** Title before the first " — " or ": " — for chips and map labels. */
export function shortTitle(title: string): string {
  return title.split(/ — | – |: /)[0].trim();
}

export const CATEGORY_ORDER: Category[] = ["classical", "language", "advanced"];

export const CATEGORY_META: Record<
  Category,
  { label: string; short: string; description: string }
> = {
  general: {
    label: "Opći materijali",
    short: "Opće",
    description:
      "Atlasi, indeksi i kanali koji pokrivaju cijelu matematiku — za orijentaciju prije odabira teme.",
  },
  classical: {
    label: "Uvod u klasična područja",
    short: "Klasično",
    description:
      "Analiza, algebra, kombinatorika, vjerojatnost, topologija, logika i računarstvo — temelji na koje se sve ostalo oslanja.",
  },
  language: {
    label: "Motivacija za bolji jezik",
    short: "Jezik",
    description:
      "Teorija kategorija i teorija tipova: što ih čini moćnima, kompozicionalnost, i klasična područja gledana s više razine.",
  },
  advanced: {
    label: "Napredno i specijalizirano",
    short: "Napredno",
    description:
      "Nastavak klasičnih područja, primjene u fizici, napredna logika, geometrija, računarstvo i teorija igara.",
  },
};

export const DIFFICULTY_LABELS: Record<number, string> = {
  1: "Znatiželjnik / srednja škola",
  2: "Prva godina",
  3: "Viši preddiplomski",
  4: "Diplomski / blizu istraživanja",
  5: "Istraživačka razina",
};
