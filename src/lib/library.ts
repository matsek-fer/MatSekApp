import type { LibraryEntry } from "@/lib/materials-meta";

/**
 * The MatSek library: problems, proofs and blogs that members write, kept
 * in matsek-fer/library and published as a static site. The site ships its
 * own search index (index/index.json, spec D-003), which is what makes the
 * library searchable from here without a server behind it.
 */
export const LIBRARY_SITE_URL =
  process.env.LIBRARY_SITE_URL?.replace(/\/?$/, "/") ??
  "https://matsek-fer.github.io/library/";
export const LIBRARY_REPO_URL = "https://github.com/matsek-fer/library";

/** The index is rebuilt on every merge; an hour of staleness is nothing. */
const INDEX_TTL_SECONDS = 60 * 60;
/** A proposal form must not hang on a site that is down. */
const INDEX_TIMEOUT_MS = 5_000;

const LIBRARY_KINDS = {
  problem: "problem",
  proof: "proof",
  blog: "blog",
} as const satisfies Record<string, LibraryEntry["kind"]>;

export interface LibrarySiteIndex {
  entries: LibraryEntry[];
  /** False when the site could not be fetched or its index did not parse. */
  available: boolean;
}

/**
 * Every bundle and forest tree on the library site as a searchable entry.
 * The fetched JSON is treated as data from outside: only the fields the
 * form needs are read, and a path has to look like one before it is turned
 * into a link, so a broken index cannot plant an href on the activity page.
 */
export async function getLibrarySiteIndex(): Promise<LibrarySiteIndex> {
  try {
    const res = await fetch(`${LIBRARY_SITE_URL}index/index.json`, {
      next: { revalidate: INDEX_TTL_SECONDS },
      signal: AbortSignal.timeout(INDEX_TIMEOUT_MS),
    });
    if (!res.ok) return { entries: [], available: false };

    const json = (await res.json()) as { items?: unknown };
    if (!Array.isArray(json.items)) return { entries: [], available: false };

    const entries: LibraryEntry[] = [];
    for (const raw of json.items) {
      if (!raw || typeof raw !== "object") continue;
      const item = raw as Record<string, unknown>;
      const title = typeof item.title === "string" ? item.title.trim() : "";
      const itemPath = typeof item.path === "string" ? item.path.trim() : "";
      if (!title || !/^[A-Za-z0-9._/-]+$/.test(itemPath) || itemPath.includes("..")) {
        continue;
      }
      const kind =
        item.kind === "tree"
          ? "tree"
          : LIBRARY_KINDS[item.type as keyof typeof LIBRARY_KINDS];
      if (!kind) continue;
      entries.push({
        kind,
        title: title.slice(0, 200),
        url: `${LIBRARY_SITE_URL}${itemPath.replace(/^\/+|\/+$/g, "")}/`,
        topic: "",
        type: "",
      });
    }
    return { entries, available: true };
  } catch (err) {
    console.error("library index fetch failed:", err);
    return { entries: [], available: false };
  }
}
