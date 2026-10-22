/**
 * Site language. Croatian is the house default; English is opt-in.
 *
 * The choice is a plain cookie rather than a URL prefix (`/en/...`), so every
 * existing link, email and bookmark keeps working and the middleware's route
 * table stays as it is. Pages read the cookie on the server, which means a
 * switch is a `router.refresh()` away and the first paint is already in the
 * right language — no flash of Croatian on an English page.
 *
 * This module is safe to import from client components; the cookie reader
 * lives in ./server so `next/headers` never ends up in a browser bundle.
 */
export type Lang = "hr" | "en";

export const LANGS: readonly Lang[] = ["hr", "en"];
export const DEFAULT_LANG: Lang = "hr";
export const LANG_COOKIE = "lang";

export function isLang(value: unknown): value is Lang {
  return typeof value === "string" && (LANGS as readonly string[]).includes(value);
}

/** Picks the entry for the language, falling back to Croatian. */
export function pick<T>(lang: Lang, table: Record<Lang, T>): T {
  return table[lang] ?? table[DEFAULT_LANG];
}
