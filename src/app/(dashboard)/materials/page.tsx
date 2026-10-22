import type { Metadata } from "next";
import { getAllTopics, getTopicShortTitles, toSummary } from "@/lib/materials";
import { getLang } from "@/lib/i18n/server";
import { MATERIALS } from "@/lib/i18n/materials";
import MaterialsExplorer from "@/components/materials/MaterialsExplorer";

export function generateMetadata(): Metadata {
  const { meta } = MATERIALS[getLang()];
  return { title: meta.title, description: meta.description };
}

export default function MaterialsPage() {
  const lang = getLang();
  const t = MATERIALS[lang];
  const all = getAllTopics();
  const titles = getTopicShortTitles();
  const general = all.find((topic) => topic.category === "general");
  const topics = all.filter((topic) => topic.category !== "general").map(toSummary);

  return (
    <div className="space-y-6">
      <header className="max-w-3xl">
        <h1 className="text-2xl font-bold text-fg">{t.heading}</h1>
        <p className="mt-2 text-fg-muted leading-relaxed">{t.lede}</p>
      </header>
      <MaterialsExplorer
        topics={topics}
        general={general ? toSummary(general) : null}
        titles={titles}
        lang={lang}
      />
    </div>
  );
}
