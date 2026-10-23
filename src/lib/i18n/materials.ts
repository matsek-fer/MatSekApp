import type { Lang } from "./index";
import {
  difficultyRange as range,
  type Category,
  type Difficulty,
  type FreeStatus,
} from "@/lib/materials-meta";

/**
 * Copy for the Materials pages: headings, filters, badges, the map legend —
 * everything around the topic files. The files themselves are written in
 * English and shown as they are in both languages.
 *
 * Counted phrases are functions because Croatian has three plural forms
 * ("1 materijal", "3 materijala", "5 materijala"; "1 besplatan",
 * "3 besplatna", "5 besplatnih"), so a `${n} materijala` template would be
 * wrong a third of the time. Client components therefore take `lang` and
 * read this table themselves rather than receiving the copy as a prop:
 * functions cannot cross the server → client boundary.
 */
export interface MaterialsCopy {
  meta: { title: string; description: string };
  heading: string;
  lede: string;

  categories: Record<Category, { label: string; description: string }>;
  difficultyLabels: Record<number, string>;
  /** Lower-case noun for "težina 2–3" badges. */
  difficultyWord: string;
  /** Tooltip of the difficulty bar. */
  difficultyTitle: (d: Difficulty | null) => string;
  /** The topic header's line: level, then the labels in brackets. */
  difficultyLong: (d: Difficulty | null) => string;

  nMaterials: (n: number) => string;
  nFree: (n: number) => string;
  nProblems: (n: number) => string;
  nSources: (n: number) => string;

  searchPlaceholder: string;
  searchLabel: string;
  filterByDifficulty: string;
  difficulty: string;
  reset: string;
  viewGrid: string;
  viewMap: string;
  legendSummary: string;
  noMatch: string;

  aiBadge: string;
  aiBadgeTitle: string;
  aiBand: string;
  aiBandTitle: string;

  prerequisites: string;
  leadsTo: string;
  openTopic: string;
  mapHint: string;
  mapAria: string;

  free: Record<FreeStatus, string>;
  linkPending: string;
  availability: string;
  groupSummary: (n: number) => string;
  expandAll: string;
  collapseAll: string;
  strengths: string;
  weaknesses: string;

  sections: {
    pitch: string;
    pitchProblems: string;
    prerequisites: string;
    general: string;
    materials: string;
    problems: string;
    matsek: string;
  };
  problemsHint: string;
  /** Rendered as `before <a>link</a> after`. */
  generalHint: { before: string; link: string; after: string };
  breadcrumb: string;
  onThisPage: string;
}

/** Croatian plural: 1/21/31 → one, 2–4/22–24 → few, the rest → many. */
function hrN(n: number, one: string, few: string, many: string): string {
  const m10 = n % 10;
  const m100 = n % 100;
  const form =
    m10 === 1 && m100 !== 11
      ? one
      : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)
        ? few
        : many;
  return `${n} ${form}`;
}

function enN(n: number, one: string, other: string): string {
  return `${n} ${n === 1 ? one : other}`;
}

const HR_LEVELS: Record<number, string> = {
  1: "Znatiželjnik / srednja škola",
  2: "Prva godina",
  3: "Viši preddiplomski",
  4: "Diplomski / blizu istraživanja",
  5: "Istraživačka razina",
};

const EN_LEVELS: Record<number, string> = {
  1: "Curious / high school",
  2: "First year",
  3: "Upper undergraduate",
  4: "Graduate / research-adjacent",
  5: "Research level",
};

const hrMaterials = (n: number) => hrN(n, "materijal", "materijala", "materijala");
const enMaterials = (n: number) => enN(n, "material", "materials");

const hr: MaterialsCopy = {
  meta: {
    title: "Materijali — MATSEK",
    description:
      "Pregled tema i materijala za učenje matematike: od klasičnih područja preko teorije kategorija do naprednih tema.",
  },
  heading: "Materijali",
  lede:
    "Karta tema kojima se sekcija bavi. Svaka tema ima kratki uvod, tri problema za početak, popis preduvjeta i odabrane materijale (knjige, skripte, videe, zadatke) s ocjenom težine i kratkim komentarom. Klikni na temu za detalje; u „karti preduvjeta” vidiš što se na što oslanja.",

  categories: {
    general: {
      label: "Opći materijali",
      description:
        "Atlasi, indeksi i kanali koji pokrivaju cijelu matematiku — za orijentaciju prije odabira teme.",
    },
    classical: {
      label: "Uvod u klasična područja",
      description:
        "Analiza, algebra, kombinatorika, vjerojatnost, topologija, logika i računarstvo — temelji na koje se sve ostalo oslanja.",
    },
    language: {
      label: "Kategorije i slično",
      description:
        "Teorija kategorija i teorija tipova: što ih čini moćnima, kompozicionalnost, i klasična područja gledana s više razine.",
    },
    advanced: {
      label: "Napredno i specijalizirano",
      description:
        "Nastavak klasičnih područja, primjene u fizici, napredna logika, geometrija, računarstvo i teorija igara.",
    },
  },
  difficultyLabels: HR_LEVELS,
  difficultyWord: "težina",
  difficultyTitle: (d) =>
    !d
      ? "Težina nije označena"
      : d.min === d.max
        ? `Težina ${d.min} — ${HR_LEVELS[d.min]}`
        : `Težina ${range(d)} — od „${HR_LEVELS[d.min]}” do „${HR_LEVELS[d.max]}”`,
  difficultyLong: (d) =>
    !d
      ? "težina nije označena"
      : d.min === d.max
        ? `težina ${d.min} (${HR_LEVELS[d.min]})`
        : `težina ${range(d)} (${HR_LEVELS[d.min]} → ${HR_LEVELS[d.max]})`,

  nMaterials: hrMaterials,
  nFree: (n) => hrN(n, "besplatan", "besplatna", "besplatnih"),
  nProblems: (n) => hrN(n, "problem", "problema", "problema"),
  nSources: (n) => hrN(n, "izvor", "izvora", "izvora"),

  searchPlaceholder: "Pretraži teme…",
  searchLabel: "Pretraži teme",
  filterByDifficulty: "Filtriraj po težini",
  difficulty: "Težina",
  reset: "poništi",
  viewGrid: "Pregled",
  viewMap: "Karta preduvjeta",
  legendSummary: "Što znače razine težine?",
  noMatch: "Nijedna tema ne odgovara filtru.",

  aiBadge: "AI",
  aiBadgeTitle: "Uvod i problemi su AI nacrt — još nisu pregledani",
  aiBand: "AI nacrt",
  aiBandTitle:
    "Ovaj odjeljak je generiran uz pomoć AI-ja i još ga nije pregledao član sekcije.",

  prerequisites: "Preduvjeti:",
  leadsTo: "Vodi u:",
  openTopic: "Otvori temu →",
  mapHint:
    "Slijeva nadesno: tema stoji desno od svojih preduvjeta. Klikni temu za njezine veze, dvaput za otvaranje.",
  mapAria: "Karta preduvjeta među temama",

  free: { yes: "besplatno", partial: "dijelom besplatno", no: "plaća se", unknown: "" },
  linkPending: "Poveznica još nije dostupna",
  availability: "Dostupnost:",
  groupSummary: (n) => `${hrMaterials(n)} · klikni na naziv za prednosti i nedostatke`,
  expandAll: "Proširi sve",
  collapseAll: "Sažmi sve",
  strengths: "Prednosti",
  weaknesses: "Nedostaci",

  sections: {
    pitch: "Zašto ova tema",
    pitchProblems: "Problemi za početak",
    prerequisites: "Preduvjeti",
    general: "Iz općih materijala",
    materials: "Materijali",
    problems: "Zadaci i nastavak",
    matsek: "MatSek materijali",
  },
  problemsHint:
    "Problemi koji se mogu razumjeti (i napasti) bez poznavanja teorije. Upute su skrivene — otvori ih tek kad zapneš.",
  generalHint: {
    before: "Dijelovi ",
    link: "općih materijala",
    after: " koji pokrivaju ovu temu.",
  },
  breadcrumb: "Putanja",
  onThisPage: "Na ovoj stranici",
};

const en: MaterialsCopy = {
  meta: {
    title: "Materials — MATSEK",
    description:
      "A map of topics and materials for learning mathematics: from the classical fields through category theory to advanced topics.",
  },
  heading: "Materials",
  lede:
    "A map of the topics the section works on. Each topic has a short introduction, three problems to start with, a list of prerequisites and a curated set of materials (books, notes, videos, problem sets) with a difficulty rating and a short comment. Click a topic for details; the prerequisite map shows what rests on what.",

  categories: {
    general: {
      label: "General materials",
      description:
        "Atlases, indices and channels that cover all of mathematics — for orientation before choosing a topic.",
    },
    classical: {
      label: "Introductions to classical fields",
      description:
        "Analysis, algebra, combinatorics, probability, topology, logic and computer science — the foundations everything else rests on.",
    },
    language: {
      label: "Categories and the like",
      description:
        "Category theory and type theory: what makes them powerful, compositionality, and the classical fields seen from a higher vantage point.",
    },
    advanced: {
      label: "Advanced and specialised",
      description:
        "The classical fields continued, applications in physics, advanced logic, geometry, computer science and game theory.",
    },
  },
  difficultyLabels: EN_LEVELS,
  difficultyWord: "difficulty",
  difficultyTitle: (d) =>
    !d
      ? "Difficulty not marked"
      : d.min === d.max
        ? `Difficulty ${d.min} — ${EN_LEVELS[d.min]}`
        : `Difficulty ${range(d)} — from “${EN_LEVELS[d.min]}” to “${EN_LEVELS[d.max]}”`,
  difficultyLong: (d) =>
    !d
      ? "difficulty not marked"
      : d.min === d.max
        ? `difficulty ${d.min} (${EN_LEVELS[d.min]})`
        : `difficulty ${range(d)} (${EN_LEVELS[d.min]} → ${EN_LEVELS[d.max]})`,

  nMaterials: enMaterials,
  nFree: (n) => `${n} free`,
  nProblems: (n) => enN(n, "problem", "problems"),
  nSources: (n) => enN(n, "source", "sources"),

  searchPlaceholder: "Search topics…",
  searchLabel: "Search topics",
  filterByDifficulty: "Filter by difficulty",
  difficulty: "Difficulty",
  reset: "clear",
  viewGrid: "Overview",
  viewMap: "Prerequisite map",
  legendSummary: "What do the difficulty levels mean?",
  noMatch: "No topic matches the filter.",

  aiBadge: "AI",
  aiBadgeTitle: "The introduction and problems are an AI draft — not yet reviewed",
  aiBand: "AI draft",
  aiBandTitle:
    "This section was generated with AI and has not yet been reviewed by a member of the section.",

  prerequisites: "Prerequisites:",
  leadsTo: "Leads to:",
  openTopic: "Open topic →",
  mapHint:
    "Left to right: a topic sits to the right of its prerequisites. Click a topic to see its links, click again to open it.",
  mapAria: "Prerequisite map of the topics",

  free: { yes: "free", partial: "partly free", no: "paid", unknown: "" },
  linkPending: "Link not yet available",
  availability: "Availability:",
  groupSummary: (n) => `${enMaterials(n)} · click a name for strengths and weaknesses`,
  expandAll: "Expand all",
  collapseAll: "Collapse all",
  strengths: "Strengths",
  weaknesses: "Weaknesses",

  sections: {
    pitch: "Why this topic",
    pitchProblems: "Problems to start with",
    prerequisites: "Prerequisites",
    general: "From the general materials",
    materials: "Materials",
    problems: "Exercises and where next",
    matsek: "MatSek materials",
  },
  problemsHint:
    "Problems you can understand (and attack) without knowing the theory. The hints are hidden — open them only when you are stuck.",
  generalHint: {
    before: "The parts of the ",
    link: "general materials",
    after: " that cover this topic.",
  },
  breadcrumb: "Breadcrumb",
  onThisPage: "On this page",
};

export const MATERIALS: Record<Lang, MaterialsCopy> = { hr, en };
