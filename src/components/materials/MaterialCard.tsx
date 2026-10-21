"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Difficulty, FreeStatus } from "@/lib/materials-meta";
import DifficultyBar from "./DifficultyBar";

export interface MaterialCardData {
  name: string;
  link: string | null;
  linkText: string;
  type: string;
  difficulty: Difficulty | null;
  difficultyText: string;
  free: FreeStatus;
  freeText: string;
}

const FREE_STYLE: Record<FreeStatus, { label: string; cls: string }> = {
  yes: { label: "besplatno", cls: "bg-emerald-50 text-emerald-700" },
  partial: { label: "dijelom besplatno", cls: "bg-amber-50 text-amber-700" },
  no: { label: "plaća se", cls: "bg-gray-100 text-gray-600" },
  unknown: { label: "", cls: "" },
};

/**
 * One material. Collapsed: name, type, difficulty, free/paid.
 * Expanded: strengths, weaknesses, the full link text.
 * `details` is rendered on the server (Markdown) and passed in.
 */
export default function MaterialCard({
  material,
  details,
  open,
  onToggle,
}: {
  material: MaterialCardData;
  details: React.ReactNode;
  open: boolean;
  onToggle: () => void;
}) {
  const free = FREE_STYLE[material.free];
  return (
    <li className="rounded-lg border border-gray-200 bg-white">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 rounded-lg"
      >
        <span
          className={cn(
            "mt-1 text-gray-400 transition-transform",
            open && "rotate-90"
          )}
          aria-hidden
        >
          ▸
        </span>
        <span className="flex-1 min-w-0">
          <span className="font-medium text-gray-900">{material.name}</span>
          <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
            {material.type && (
              <span className="rounded bg-gray-100 px-1.5 py-0.5 uppercase tracking-wide">
                {material.type}
              </span>
            )}
            <DifficultyBar difficulty={material.difficulty} />
            {material.difficultyText && (
              <span>težina {material.difficultyText}</span>
            )}
            {free.label && (
              <span className={cn("rounded px-1.5 py-0.5", free.cls)}>
                {free.label}
              </span>
            )}
          </span>
        </span>
      </button>
      {open && (
        <div className="border-t border-gray-100 px-4 py-3 pl-11 text-sm">
          {material.link ? (
            <a
              href={material.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-600 hover:underline break-all"
            >
              {material.link.replace(/^https?:\/\//, "")}
            </a>
          ) : (
            <span className="text-gray-500 italic">
              {material.linkText.replace(/[*_]/g, "").trim() ||
                "Poveznica još nije dostupna"}
            </span>
          )}
          {material.linkText &&
            material.link &&
            material.linkText.replace(material.link, "").trim() && (
              <p className="mt-1 text-gray-500">
                {material.linkText.replace(material.link, "").replace(/^\s*[·,]\s*/, "")}
              </p>
            )}
          {material.freeText &&
            !/^(yes|no|partial)$/i.test(material.freeText.trim()) && (
              <p className="mt-1 text-gray-500">
                Dostupnost: {material.freeText}
              </p>
            )}
          <div className="mt-3">{details}</div>
        </div>
      )}
    </li>
  );
}
