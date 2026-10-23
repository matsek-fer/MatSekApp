import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getConnection,
  getConnectionsFor,
  getTopicShortTitles,
  getTopicTitles,
} from "@/lib/materials";
import { getLang } from "@/lib/i18n/server";
import { MATERIALS } from "@/lib/i18n/materials";
import Markdown from "@/components/materials/Markdown";
import AiBand from "@/components/materials/AiBand";
import StrengthDots from "@/components/materials/StrengthDots";

export function generateMetadata({
  params,
}: {
  params: { pair: string };
}): Metadata {
  const c = getConnection(params.pair);
  const { meta } = MATERIALS[getLang()];
  if (!c) return { title: meta.title };
  const short = getTopicShortTitles();
  return {
    title: `${short[c.a]} ↔ ${short[c.b]} — ${meta.title}`,
    description: c.tagline,
  };
}

/** One edge of the connections map: how two topics trade, at length. */
export default function ConnectionPage({ params }: { params: { pair: string } }) {
  const c = getConnection(params.pair);
  if (!c) notFound();

  const lang = getLang();
  const t = MATERIALS[lang];
  const titles = getTopicTitles();
  const short = getTopicShortTitles();
  const ids = Object.keys(titles);
  const chip =
    "mr-1 inline-block rounded bg-surface-hover px-2 py-0.5 text-fg hover:bg-brand/10 hover:text-brand";

  return (
    <div className="space-y-6">
      <nav className="text-sm text-fg-muted" aria-label={t.breadcrumb}>
        <Link href="/materials" className="text-brand hover:underline">
          {t.heading}
        </Link>
        <span className="mx-2">/</span>
        <Link href="/materials?view=connections" className="text-brand hover:underline">
          {t.connectionsCrumb}
        </Link>
      </nav>

      <header className="rounded-xl border border-border bg-surface p-6">
        <h1 className="text-2xl font-bold text-fg">
          {short[c.a]} ↔ {short[c.b]}
        </h1>
        <p className="mt-2 text-fg-muted leading-relaxed">{c.tagline}</p>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-fg-muted">
          <span className="inline-flex items-center gap-2">
            <StrengthDots strength={c.strength} lang={lang} />
            {t.strengthWord} {c.strength}/3 · {t.strengthLabels[c.strength]}
          </span>
          <span>
            <span className="text-fg-muted">{t.topicsLabel} </span>
            {[c.a, c.b].map((id) => (
              <Link key={id} href={`/materials/${id}`} className={chip}>
                {titles[id]}
              </Link>
            ))}
          </span>
        </div>
      </header>

      <AiBand active={c.aiGenerated} lang={lang}>
        <Markdown topicIds={ids}>{c.body}</Markdown>
      </AiBand>

      <div className="grid gap-6 sm:grid-cols-2">
        {[c.a, c.b].map((id) => {
          const list = getConnectionsFor(id).filter((o) => o.pair !== c.pair);
          return (
            <section key={id} className="rounded-xl border border-border bg-surface p-5">
              <h2 className="text-base font-semibold text-fg">
                {t.otherConnections(short[id])}
              </h2>
              {list.length === 0 ? (
                <p className="mt-2 text-sm text-fg-subtle">—</p>
              ) : (
                <ul className="mt-3 space-y-2 text-sm">
                  {list.map((o) => {
                    const otherId = o.a === id ? o.b : o.a;
                    return (
                      <li key={o.pair}>
                        <Link
                          href={`/materials/connections/${o.pair}`}
                          className="inline-flex items-center gap-2 font-medium text-brand hover:underline"
                        >
                          {short[otherId]}
                          <StrengthDots strength={o.strength} lang={lang} />
                        </Link>
                        <span className="block text-fg-muted">{o.tagline}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
