export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

/**
 * Applies the stored (or system) theme before first paint.
 *
 * Injected as a blocking inline script in the root layout — if this ran as a
 * React effect instead, the page would paint light and then flip.
 */
export const THEME_INIT_SCRIPT = `
(function () {
  try {
    var t = localStorage.getItem(${JSON.stringify(STORAGE_KEY)});
    var dark = t === "dark" || (!t && matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", dark);
  } catch (e) {}
})();
`;

export function getTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function setTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Private mode / storage disabled — the class still applies for this visit.
  }
}

export function toggleTheme() {
  setTheme(getTheme() === "dark" ? "light" : "dark");
}
