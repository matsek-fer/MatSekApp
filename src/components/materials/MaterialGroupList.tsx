"use client";

import { useState } from "react";
import MaterialCard, { type MaterialCardData } from "./MaterialCard";

export interface MaterialGroupData {
  title: string;
  notes: React.ReactNode | null;
  materials: { data: MaterialCardData; details: React.ReactNode }[];
}

/**
 * All material groups of a topic, with a single expand/collapse-all control.
 * Collapsed by default: the overview is the list of names and badges.
 */
export default function MaterialGroupList({
  groups,
}: {
  groups: MaterialGroupData[];
}) {
  const [open, setOpen] = useState<Set<string>>(new Set());
  const total = groups.reduce((n, g) => n + g.materials.length, 0);
  const allOpen = open.size >= total && total > 0;

  const key = (g: string, i: number) => `${g}::${i}`;
  const toggle = (k: string) =>
    setOpen((s) => {
      const n = new Set(s);
      n.has(k) ? n.delete(k) : n.add(k);
      return n;
    });
  const toggleAll = () =>
    setOpen(
      allOpen
        ? new Set()
        : new Set(groups.flatMap((g) => g.materials.map((_, i) => key(g.title, i))))
    );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <p className="text-sm text-fg-muted">
          {total} {total === 1 ? "materijal" : total < 5 ? "materijala" : "materijala"} ·
          klikni na naziv za prednosti i nedostatke
        </p>
        <button
          type="button"
          onClick={toggleAll}
          className="text-sm text-brand hover:underline"
        >
          {allOpen ? "Sažmi sve" : "Proširi sve"}
        </button>
      </div>
      {groups.map((g) => (
        <section key={g.title} id={`g-${slug(g.title)}`}>
          {groups.length > 1 && (
            <h3 className="mb-2 text-base font-semibold text-fg">
              {g.title}
            </h3>
          )}
          {g.notes}
          <ul className="space-y-2">
            {g.materials.map((m, i) => (
              <MaterialCard
                key={key(g.title, i)}
                material={m.data}
                details={m.details}
                open={open.has(key(g.title, i))}
                onToggle={() => toggle(key(g.title, i))}
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}
