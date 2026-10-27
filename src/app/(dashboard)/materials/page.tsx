import type { Metadata } from "next";
import {
  VIEWS,
  getAllTopics,
  getConnections,
  getTopicShortTitles,
  toConnectionSummary,
  toSummary,
  type View,
} from "@/lib/materials";
import { getLang } from "@/lib/i18n/server";
import { MATERIALS } from "@/lib/i18n/materials";
import MaterialsExplorer from "@/components/materials/MaterialsExplorer";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = MATERIALS[await getLang()];
  return { title: meta.title, description: meta.description };
}

export default async function MaterialsPage({
  searchParams,
}: {
  searchParams?: Promise<{ view?: string }>;
}) {
  const lang = await getLang();
  const t = MATERIALS[lang];
  const all = getAllTopics();
  const titles = getTopicShortTitles();
  const general = all.find((topic) => topic.category === "general");
  const topics = all.filter((topic) => topic.category !== "general").map(toSummary);
  const connections = getConnections().map(toConnectionSummary);
  const view = (await searchParams)?.view;
  const initialView = VIEWS.includes(view as View) ? (view as View) : "grid";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-fg">{t.heading}</h1>
      <MaterialsExplorer
        topics={topics}
        hasGeneral={Boolean(general)}
        titles={titles}
        connections={connections}
        lang={lang}
        initialView={initialView}
      />
    </div>
  );
}
