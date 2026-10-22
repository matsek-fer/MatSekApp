import type { Metadata } from "next";
import { getAllTopics, getTopicShortTitles, toSummary } from "@/lib/materials";
import MaterialsExplorer from "@/components/materials/MaterialsExplorer";

export const metadata: Metadata = {
  title: "Materijali — MATSEK",
  description:
    "Pregled tema i materijala za učenje matematike: od klasičnih područja preko teorije kategorija do naprednih tema.",
};

export default function MaterialsPage() {
  const all = getAllTopics();
  const titles = getTopicShortTitles();
  const general = all.find((t) => t.category === "general");
  const topics = all.filter((t) => t.category !== "general").map(toSummary);

  return (
    <div className="space-y-6">
      <header className="max-w-3xl">
        <h1 className="text-2xl font-bold text-fg">Materijali</h1>
        <p className="mt-2 text-fg-muted leading-relaxed">
          Karta tema kojima se sekcija bavi. Svaka tema ima kratki uvod,
          tri problema za početak, popis preduvjeta i odabrane materijale
          (knjige, skripte, videe, zadatke) s ocjenom težine i kratkim
          komentarom. Klikni na temu za detalje; u „karti preduvjeta” vidiš
          što se na što oslanja.
        </p>
      </header>
      <MaterialsExplorer
        topics={topics}
        general={general ? toSummary(general) : null}
        titles={titles}
      />
    </div>
  );
}
