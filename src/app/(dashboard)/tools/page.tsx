import type { Metadata } from "next";
import { getLang } from "@/lib/i18n/server";
import { Toc } from "@/components/docs";
import * as hr from "./content/hr";
import * as en from "./content/en";

/**
 * The tools guide: vision, how to use each tool, and the rules underneath.
 * Public, and the one page written in both languages — the content lives in
 * ./content/<lang>.tsx as ordinary JSX so the two versions can differ in
 * shape where a straight translation would read badly.
 */
const CONTENT = { hr, en } as const;

export function generateMetadata(): Metadata {
  const { meta } = CONTENT[getLang()];
  return { title: meta.title, description: meta.description };
}

export default function ToolsPage() {
  const lang = getLang();
  const { meta, toc, default: Content } = CONTENT[lang];

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-10 max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-fg sm:text-4xl">
          {meta.heading}
        </h1>
        <p className="mt-3 text-lg leading-8 text-fg-muted">{meta.lede}</p>
      </header>

      <div className="lg:grid lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12">
        {/* Sticky on wide screens; on narrow ones it is a plain list above
            the text, which is where a reader on a phone expects it. */}
        <aside className="mb-10 lg:sticky lg:top-24 lg:mb-0 lg:self-start">
          <Toc entries={toc} title={meta.tocTitle} />
        </aside>
        <article className="max-w-3xl space-y-12">
          <Content />
        </article>
      </div>
    </div>
  );
}
