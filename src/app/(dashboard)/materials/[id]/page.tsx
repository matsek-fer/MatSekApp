import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllTopics, getTopic, getTopicTitles } from "@/lib/materials";
import { getLang } from "@/lib/i18n/server";
import { MATERIALS } from "@/lib/i18n/materials";
import Markdown from "@/components/materials/Markdown";
import AiBand from "@/components/materials/AiBand";
import DifficultyBar from "@/components/materials/DifficultyBar";
import MaterialGroupList, {
  type MaterialGroupData,
} from "@/components/materials/MaterialGroupList";

export function generateMetadata({
  params,
}: {
  params: { id: string };
}): Metadata {
  const topic = getTopic(params.id);
  const { meta } = MATERIALS[getLang()];
  return topic
    ? { title: `${topic.title} — ${meta.title}`, description: topic.tagline }
    : { title: meta.title };
}

export default function TopicPage({ params }: { params: { id: string } }) {
  const topic = getTopic(params.id);
  if (!topic) notFound();

  const lang = getLang();
  const t = MATERIALS[lang];
  const SECTION_TITLES = t.sections;

  const titles = getTopicTitles();
  const ids = Object.keys(titles);
  const all = getAllTopics();
  const idx = all.findIndex((t) => t.id === topic.id);
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx < all.length - 1 ? all[idx + 1] : null;

  const ai = (s: string) => topic.aiGenerated.includes(s);

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
  if (topic.sections.pitchProblems)
    toc.push({ id: "problems", label: SECTION_TITLES.pitchProblems });
  if (topic.sections.prerequisites)
    toc.push({ id: "prerequisites", label: SECTION_TITLES.prerequisites });
  if (topic.sections.general) toc.push({ id: "general", label: SECTION_TITLES.general });
  if (groups.length) toc.push({ id: "materials", label: SECTION_TITLES.materials });
  if (topic.sections.problems) toc.push({ id: "exercises", label: SECTION_TITLES.problems });
  if (topic.sections.matsek) toc.push({ id: "matsek", label: SECTION_TITLES.matsek });

  return (
    <div className="space-y-6">
      <nav className="text-sm text-fg-muted" aria-label={t.breadcrumb}>
        <Link href="/materials" className="text-brand hover:underline">
          {t.heading}
        </Link>
        <span className="mx-2">/</span>
        <span>{t.categories[topic.category].label}</span>
      </nav>

      <header className="rounded-xl border border-border bg-surface p-6">
        <h1 className="text-2xl font-bold text-fg">{topic.title}</h1>
        <p className="mt-2 text-fg-muted leading-relaxed">{topic.tagline}</p>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-fg-muted">
          <span className="inline-flex items-center gap-2">
            <DifficultyBar difficulty={topic.difficulty} lang={lang} size="md" />
            <span>{t.difficultyLong(topic.difficulty)}</span>
          </span>
          <span>
            {t.nMaterials(topic.counts.materials)}
            {topic.counts.free > 0 && `, ${t.nFree(topic.counts.free)}`}
          </span>
          {topic.counts.problems > 0 && <span>{t.nProblems(topic.counts.problems)}</span>}
        </div>
        {(topic.prerequisites.length > 0 || topic.requiredBy.length > 0) && (
          <div className="mt-4 grid gap-2 sm:grid-cols-2 text-sm">
            {topic.prerequisites.length > 0 && (
              <div>
                <span className="text-fg-muted">{t.prerequisites} </span>
                {topic.prerequisites.map((p) => (
                  <Link
                    key={p}
                    href={`/materials/${p}`}
                    className="mr-1 inline-block rounded bg-surface-hover px-2 py-0.5 text-fg hover:bg-brand/10 hover:text-brand"
                  >
                    {titles[p] ?? p}
                  </Link>
                ))}
              </div>
            )}
            {topic.requiredBy.length > 0 && (
              <div>
                <span className="text-fg-muted">{t.leadsTo} </span>
                {topic.requiredBy.map((p) => (
                  <Link
                    key={p}
                    href={`/materials/${p}`}
                    className="mr-1 inline-block rounded bg-surface-hover px-2 py-0.5 text-fg hover:bg-brand/10 hover:text-brand"
                  >
                    {titles[p] ?? p}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_200px]">
        <div className="space-y-10 min-w-0">
          {topic.sections.pitch && (
            <Section id="pitch" title={SECTION_TITLES.pitch}>
              <AiBand active={ai("pitch")} lang={lang}>
                <Markdown topicIds={ids}>{topic.sections.pitch}</Markdown>
              </AiBand>
            </Section>
          )}

          {topic.sections.pitchProblems && (
            <Section
              id="problems"
              title={SECTION_TITLES.pitchProblems}
              hint={t.problemsHint}
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

          {topic.sections.matsek && (
            <Section id="matsek" title={SECTION_TITLES.matsek}>
              <AiBand active={ai("matsek_materials")} lang={lang}>
                <Markdown topicIds={ids}>{topic.sections.matsek}</Markdown>
              </AiBand>
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
              <Link href={`/materials/${next.id}`} className="text-brand hover:underline text-right">
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
      {hint && <p className="mt-1 mb-3 text-sm text-fg-muted">{hint}</p>}
      <div className={hint ? "" : "mt-3"}>{children}</div>
    </section>
  );
}
