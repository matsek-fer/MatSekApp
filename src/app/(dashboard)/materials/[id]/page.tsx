import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllTopics,
  getConnectionsFor,
  getTopic,
  getTopicShortTitles,
  getTopicTitles,
} from "@/lib/materials";
import { getLang } from "@/lib/i18n/server";
import { MATERIALS } from "@/lib/i18n/materials";
import Markdown from "@/components/materials/Markdown";
import AiBand from "@/components/materials/AiBand";
import StrengthDots from "@/components/materials/StrengthDots";
import MaterialGroupList, {
  type MaterialGroupData,
} from "@/components/materials/MaterialGroupList";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const topic = getTopic((await params).id);
  const { meta } = MATERIALS[await getLang()];
  return topic
    ? { title: `${topic.title} — ${meta.title}`, description: topic.tagline }
    : { title: meta.title };
}

export default async function TopicPage({ params }: { params: Promise<{ id: string }> }) {
  const topic = getTopic((await params).id);
  if (!topic) notFound();

  const lang = await getLang();
  const t = MATERIALS[lang];
  const SECTION_TITLES = t.sections;

  const titles = getTopicTitles();
  const short = getTopicShortTitles();
  const ids = Object.keys(titles);
  const connections = getConnectionsFor(topic.id);
  const all = getAllTopics();
  const idx = all.findIndex((t) => t.id === topic.id);
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx < all.length - 1 ? all[idx + 1] : null;

  const ai = (s: string) => topic.aiGenerated.includes(s);

  // The content schema asks for hints in <details> blocks after each
  // problem, but only some topics have them yet. The note under the heading
  // says which case this is, instead of promising hidden hints that are not
  // there.
  const hasHints = /<details/i.test(topic.sections.pitchProblems);

  // The MatSek section holds AI-drafted suggestions until a member writes
  // real material; while flagged it reads as "none yet, here is what could
  // come", never as a list of things that exist. The general page is an
  // atlas of other people's maps, not a field the section writes for, so
  // it carries no such panel.
  const matsekIsDraft = ai("matsek_materials");
  const showMatsek = topic.category !== "general";

  const groups: MaterialGroupData[] = topic.materialGroups.map((g) => ({
    title: g.title,
    notes: g.notes ? (
      <Markdown topicIds={ids} className="mb-3 text-sm">
        {g.notes}
      </Markdown>
    ) : null,
    materials: g.materials.map((m) => ({
      data: {
        name: m.name,
        link: m.link,
        linkText: m.linkText,
        type: m.type,
        difficulty: m.difficulty,
        difficultyText: m.difficultyText,
        free: m.free,
        freeText: m.freeText,
      },
      details: (
        <dl className="grid gap-3 sm:grid-cols-2">
          {m.strengths && (
            <div>
              <dt className="mb-1 text-xs font-semibold uppercase tracking-wide text-success-fg">
                {t.strengths}
              </dt>
              <dd className="text-fg">
                <Markdown topicIds={ids} inline>
                  {m.strengths}
                </Markdown>
              </dd>
            </div>
          )}
          {m.weaknesses && (
            <div>
              <dt className="mb-1 text-xs font-semibold uppercase tracking-wide text-danger-fg">
                {t.weaknesses}
              </dt>
              <dd className="text-fg">
                <Markdown topicIds={ids} inline>
                  {m.weaknesses}
                </Markdown>
              </dd>
            </div>
          )}
        </dl>
      ),
    })),
  }));

  const toc: { id: string; label: string }[] = [];
  if (topic.sections.pitch) toc.push({ id: "pitch", label: SECTION_TITLES.pitch });
  if (showMatsek) toc.push({ id: "matsek", label: SECTION_TITLES.matsek });
  if (topic.sections.pitchProblems)
    toc.push({ id: "problems", label: SECTION_TITLES.pitchProblems });
  if (topic.sections.prerequisites)
    toc.push({ id: "prerequisites", label: SECTION_TITLES.prerequisites });
  if (connections.length)
    toc.push({ id: "connections", label: SECTION_TITLES.connections });
  if (topic.sections.general) toc.push({ id: "general", label: SECTION_TITLES.general });
  if (groups.length) toc.push({ id: "materials", label: SECTION_TITLES.materials });
  if (topic.sections.problems) toc.push({ id: "exercises", label: SECTION_TITLES.problems });

  return (
    <div className="space-y-6">
      <nav className="text-sm text-fg-muted" aria-label={t.breadcrumb}>
        <Link href="/materials" className="text-brand hover:underline">
          {t.heading}
        </Link>
        <span className="mx-2">/</span>
        <span>{t.categories[topic.category].label}</span>
      </nav>

      <header>
        <h1 className="text-2xl font-bold text-fg">{topic.title}</h1>
        {(topic.prerequisites.length > 0 || topic.requiredBy.length > 0) && (
          <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            {topic.prerequisites.length > 0 && (
              <div>
                <dt className="mb-1 text-xs uppercase tracking-wide text-fg-subtle">
                  {t.prerequisites}
                </dt>
                <dd>
                  <TopicChips ids={topic.prerequisites} titles={titles} />
                </dd>
              </div>
            )}
            {topic.requiredBy.length > 0 && (
              <div>
                <dt className="mb-1 text-xs uppercase tracking-wide text-fg-subtle">
                  {t.leadsTo}
                </dt>
                <dd>
                  <TopicChips ids={topic.requiredBy} titles={titles} />
                </dd>
              </div>
            )}
          </dl>
        )}
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_200px]">
        <div className="min-w-0 space-y-10">
          {topic.sections.pitch && (
            <Section id="pitch" title={SECTION_TITLES.pitch}>
              <AiBand active={ai("pitch")} lang={lang}>
                <Markdown topicIds={ids}>{topic.sections.pitch}</Markdown>
              </AiBand>
            </Section>
          )}

          {showMatsek && (
            <section
              id="matsek"
              className="scroll-mt-24 rounded-xl border border-brand/30 bg-brand/5 p-5"
            >
              <h2 className="text-xl font-semibold text-fg">{SECTION_TITLES.matsek}</h2>
              {matsekIsDraft || !topic.sections.matsek ? (
                <>
                  <p className="mt-2 text-fg-muted">{t.matsekNone}</p>
                  {topic.sections.matsek && (
                    <div className="mt-5">
                      <h3 className="text-base font-semibold text-fg">{t.matsekFuture}</h3>
                      <p className="mb-3 mt-1 text-sm text-fg-muted">{t.matsekFutureHint}</p>
                      <AiBand active lang={lang}>
                        <Markdown topicIds={ids}>{topic.sections.matsek}</Markdown>
                      </AiBand>
                    </div>
                  )}
                </>
              ) : (
                <div className="mt-3">
                  <Markdown topicIds={ids}>{topic.sections.matsek}</Markdown>
                </div>
              )}
            </section>
          )}

          {topic.sections.pitchProblems && (
            <Section
              id="problems"
              title={SECTION_TITLES.pitchProblems}
              hint={hasHints ? t.problemsHint : t.problemsHintNoHints}
            >
              <AiBand active={ai("pitch_problems")} lang={lang}>
                <Markdown topicIds={ids} className="prose-ol:space-y-6">
                  {topic.sections.pitchProblems}
                </Markdown>
              </AiBand>
            </Section>
          )}

          {topic.sections.prerequisites && (
            <Section id="prerequisites" title={SECTION_TITLES.prerequisites}>
              <Markdown topicIds={ids}>{topic.sections.prerequisites}</Markdown>
            </Section>
          )}

          {connections.length > 0 && (
            <Section
              id="connections"
              title={SECTION_TITLES.connections}
              hint={
                <>
                  {t.connectionsSectionHint}{" "}
                  <Link href="/materials?view=connections" className="text-brand hover:underline">
                    {t.connectionsAll}
                  </Link>
                </>
              }
            >
              <ul className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
                {connections.map((c) => {
                  const otherId = c.a === topic.id ? c.b : c.a;
                  return (
                    <li key={c.pair} className="min-w-0">
                      <Link
                        href={`/materials/connections/${c.pair}`}
                        className="inline-flex items-center gap-2 font-medium text-brand hover:underline"
                      >
                        {short[otherId] ?? otherId}
                        <StrengthDots strength={c.strength} lang={lang} />
                      </Link>
                      <span className="block text-fg-muted">{c.tagline}</span>
                    </li>
                  );
                })}
              </ul>
            </Section>
          )}

          {topic.sections.general && (
            <Section
              id="general"
              title={SECTION_TITLES.general}
              hint={
                <>
                  {t.generalHint.before}
                  <Link href="/materials/general" className="text-brand hover:underline">
                    {t.generalHint.link}
                  </Link>
                  {t.generalHint.after}
                </>
              }
            >
              <Markdown topicIds={ids}>{topic.sections.general}</Markdown>
            </Section>
          )}

          {groups.length > 0 && (
            <Section id="materials" title={SECTION_TITLES.materials}>
              <MaterialGroupList groups={groups} lang={lang} />
            </Section>
          )}

          {topic.sections.problems && (
            <Section id="exercises" title={SECTION_TITLES.problems}>
              <Markdown topicIds={ids}>{topic.sections.problems}</Markdown>
            </Section>
          )}

          <nav className="flex justify-between border-t border-border pt-6 text-sm">
            {prev ? (
              <Link href={`/materials/${prev.id}`} className="text-brand hover:underline">
                ← {prev.title}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={`/materials/${next.id}`} className="text-right text-brand hover:underline">
                {next.title} →
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-1 text-sm">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-fg-subtle">
              {t.onThisPage}
            </div>
            {toc.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="block rounded px-2 py-1 text-fg-muted hover:bg-surface-hover hover:text-fg"
              >
                {s.label}
              </a>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

function TopicChips({
  ids,
  titles,
}: {
  ids: string[];
  titles: Record<string, string>;
}) {
  return (
    <span className="flex flex-wrap gap-1">
      {ids.map((p) => (
        <Link
          key={p}
          href={`/materials/${p}`}
          className="inline-block rounded bg-surface-hover px-2 py-0.5 text-fg hover:bg-brand/10 hover:text-brand"
        >
          {titles[p] ?? p}
        </Link>
      ))}
    </span>
  );
}

function Section({
  id,
  title,
  hint,
  children,
}: {
  id: string;
  title: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-xl font-semibold text-fg">{title}</h2>
      {hint && <p className="mb-3 mt-1 text-sm text-fg-muted">{hint}</p>}
      <div className={hint ? "" : "mt-3"}>{children}</div>
    </section>
  );
}
