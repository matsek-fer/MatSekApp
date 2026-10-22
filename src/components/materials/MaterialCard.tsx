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
  yes: { label: "besplatno", cls: "bg-success-bg text-success-fg" },
  partial: { label: "dijelom besplatno", cls: "bg-warning-bg text-warning-fg" },
  no: { label: "plaća se", cls: "bg-surface-hover text-fg-muted" },
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
    <li className="rounded-lg border border-border bg-surface">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-surface-hover rounded-lg"
      >
        <span
          className={cn(
            "mt-1 text-fg-subtle transition-transform",
            open && "rotate-90"
          )}
          aria-hidden
        >
          ▸
        </span>
        <span className="flex-1 min-w-0">
          <span className="font-medium text-fg">{material.name}</span>
          <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-fg-muted">
            {material.type && (
              <span className="rounded bg-surface-hover px-1.5 py-0.5 uppercase tracking-wide">
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
        <div className="border-t border-border px-4 py-3 pl-11 text-sm">
          {material.link ? (
            <a
              href={material.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand hover:underline break-all"
            >
              {material.link.replace(/^https?:\/\//, "")}
            </a>
          ) : (
            <span className="text-fg-muted italic">
              {material.linkText.replace(/[*_]/g, "").trim() ||
                "Poveznica još nije dostupna"}
            </span>
          )}
          {material.linkText &&
            material.link &&
            material.linkText.replace(material.link, "").trim() && (
              <p className="mt-1 text-fg-muted">
                {material.linkText.replace(material.link, "").replace(/^\s*[·,]\s*/, "")}
              </p>
            )}
          {material.freeText &&
            !/^(yes|no|partial)$/i.test(material.freeText.trim()) && (
              <p className="mt-1 text-fg-muted">
                Dostupnost: {material.freeText}
              </p>
            )}
          <div className="mt-3">{details}</div>
        </div>
      )}
    </li>
  );
}
