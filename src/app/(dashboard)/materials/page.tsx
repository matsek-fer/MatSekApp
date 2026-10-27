import type { Metadata } from "next";
import { getAllTopics, getTopicShortTitles, toSummary } from "@/lib/materials";
import MaterialsExplorer from "@/components/materials/MaterialsExplorer";

export const metadata: Metadata = {
  title: "Materijali — MATSEK",
  description:
    "Teme kojima se sekcija bavi: klasična područja, teorija kategorija i napredne teme, svaka sa svojim materijalima.",
};

export default function MaterialsPage() {
  const all = getAllTopics();
  const titles = getTopicShortTitles();
  const general = all.find((t) => t.category === "general");
  const topics = all.filter((t) => t.category !== "general").map(toSummary);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-fg">Materijali</h1>
      <MaterialsExplorer
        topics={topics}
        hasGeneral={Boolean(general)}
        titles={titles}
      />
    </div>
  );
}
