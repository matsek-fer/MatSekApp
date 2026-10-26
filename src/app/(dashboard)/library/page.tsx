import type { Metadata } from "next";
import { getLang } from "@/lib/i18n/server";
import type { Lang } from "@/lib/i18n";

const LIBRARY_SITE = "https://matsek-fer.github.io/library/";
const LIBRARY_REPO = "https://github.com/matsek-fer/library";

/**
 * A placeholder until the library is rendered here natively. The library
 * itself already exists — a git repository of problems, proofs and blogs
 * with its own static site — so the page points there rather than at
 * nothing; the survey that sized the native version is in the materials
 * README's TODO.
 */
const CONTENT = {
  hr: {
    title: "Knjižnica",
    description:
      "Zajednička knjižnica sekcije: zadaci, dokazi i blogovi članova, objavljeni pod CC BY 4.0.",
    badge: "Uskoro",
    heading: "Knjižnica",
    lede:
      "Zajednička knjižnica sekcije — zadaci, dokazi i blogovi koje članovi pišu i objavljuju pod licencom CC BY 4.0, i šuma pojmova koju alati iz njih uzgajaju — uskoro stiže i na ovu stranicu.",
    meanwhile: "Dok ne stigne, knjižnica živi na vlastitoj stranici:",
    site: "Otvori knjižnicu",
    repo: "Repozitorij na GitHubu",
    note: "Ovdje će se pojaviti isti sadržaj, u istom ruhu kao materijali, s pretraživanjem i kartom šume.",
  },
  en: {
    title: "Library",
    description:
      "The section's shared library: members' problems, proofs and blogs, published under CC BY 4.0.",
    badge: "Coming soon",
    heading: "Library",
    lede:
      "The section's shared library — problems, proofs and blogs that members write and publish under CC BY 4.0, and the forest of concepts the tools grow from them — is coming to this site soon.",
    meanwhile: "Until then it lives on its own page:",
    site: "Open the library",
    repo: "Repository on GitHub",
    note: "The same content will appear here, in the same shape as the materials, with search and the forest map.",
  },
} satisfies Record<Lang, Record<string, string>>;

export function generateMetadata(): Metadata {
  const t = CONTENT[getLang()];
  return { title: t.title, description: t.description };
}

export default function LibraryPage() {
  const t = CONTENT[getLang()];
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header className="space-y-3">
        <span className="inline-flex items-center rounded-full bg-warning-bg px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-warning-fg">
          {t.badge}
        </span>
        <h1 className="text-2xl font-bold text-fg">{t.heading}</h1>
        <p className="text-fg-muted leading-relaxed">{t.lede}</p>
      </header>

      <div className="rounded-xl border border-border bg-surface p-6">
        <p className="text-sm text-fg-muted">{t.meanwhile}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={LIBRARY_SITE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-lg bg-brand px-4 py-2 text-sm font-medium text-brand-fg hover:bg-brand/90"
          >
            {t.site} →
          </a>
          <a
            href={LIBRARY_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-lg border border-border-strong bg-surface px-4 py-2 text-sm font-medium text-fg hover:bg-surface-hover"
          >
            {t.repo}
          </a>
        </div>
      </div>

      <p className="text-sm text-fg-subtle">{t.note}</p>
    </div>
  );
}
