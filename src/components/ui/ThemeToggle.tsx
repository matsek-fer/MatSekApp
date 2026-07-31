"use client";

import { toggleTheme } from "@/lib/theme";

/**
 * Both icons are always rendered and swapped with CSS, so the button is correct
 * on the very first paint — no theme state in React, no hydration mismatch.
 */
export default function ThemeToggle() {
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-lg p-2 text-fg-muted transition-colors
                 hover:bg-surface-hover hover:text-fg"
      aria-label="Promijeni temu"
      title="Promijeni temu"
    >
      <MoonIcon className="dark:hidden" />
      <SunIcon className="hidden dark:block" />
    </button>
  );
}

const ICON_PROPS = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function SunIcon({ className }: { className?: string }) {
  return (
    <svg {...ICON_PROPS} className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg {...ICON_PROPS} className={className} aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
