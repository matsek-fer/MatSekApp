"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { LANG_COOKIE, type Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const YEAR = 60 * 60 * 24 * 365;

/**
 * Flips the site language. The cookie is written from the browser and the
 * server components are re-rendered with `router.refresh()`, so the page
 * changes in place — no full reload, no lost scroll position.
 */
export default function LanguageToggle({
  lang,
  label,
}: {
  lang: Lang;
  label: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const next: Lang = lang === "hr" ? "en" : "hr";

  const flip = () => {
    document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=${YEAR}; samesite=lax`;
    document.documentElement.lang = next;
    startTransition(() => router.refresh());
  };

  return (
    <button
      type="button"
      onClick={flip}
      aria-label={label}
      title={label}
      className={cn(
        "rounded-lg px-2 py-1.5 text-xs font-semibold uppercase tracking-wide",
        "text-fg-muted transition-colors hover:bg-surface-hover hover:text-fg",
        pending && "opacity-60"
      )}
    >
      {next}
    </button>
  );
}
