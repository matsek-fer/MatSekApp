"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import PdfReader from "@/components/documents/PdfReader";
import TextReader from "@/components/documents/TextReader";
import type { DocumentBlock, Document as DocumentRow } from "@/types";

/**
 * The reading workspace, and the one place that escapes the dashboard shell.
 *
 * The reader needs its own scroll container pinned under the navbar, which
 * `(dashboard)/layout.tsx` does not offer: it is `min-h-screen` with a padded
 * `max-w-7xl` main, and under `md` an extra nav row makes the bar taller than
 * 4rem. So a hardcoded `calc(100dvh - 4rem)` would be wrong on exactly the
 * screens where it matters most.
 *
 * Instead the navbar is MEASURED. `#app-navbar` is read on layout and kept
 * current with a ResizeObserver — the same idiom ActivityTimeline already
 * uses — and written to `--reader-top`, which positions this panel.
 *
 * `z-30` deliberately sits under the navbar's `z-40`, so the navbar stays
 * usable while reading, and under the `z-50` dropdown and modal tier.
 */

interface ReaderShellProps {
  document: DocumentRow;
  blocks: DocumentBlock[];
  fileUrl: string | null;
}

const FALLBACK_TOP = 64;

export default function ReaderShell({
  document: row,
  blocks,
  fileUrl,
}: ReaderShellProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [top, setTop] = useState(FALLBACK_TOP);

  useLayoutEffect(() => {
    const navbar = window.document.getElementById("app-navbar");
    if (!navbar) return;

    const measure = () => setTop(navbar.offsetHeight);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(navbar);
    return () => observer.disconnect();
  }, []);

  // The page behind a fixed, full-height reader must not scroll as well, or
  // the wheel moves both. Restores whatever was there rather than assuming
  // the default, so leaving the reader cannot strand the body scroll-locked.
  useEffect(() => {
    const body = window.document.body;
    const previous = body.style.overflow;
    body.style.overflow = "hidden";
    return () => {
      body.style.overflow = previous;
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="fixed inset-x-0 bottom-0 z-30 flex flex-col bg-bg"
      style={{ top: `${top}px` }}
    >
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2">
        <div className="flex min-w-0 items-baseline gap-3">
          <Link
            href="/documents"
            className="shrink-0 text-sm text-fg-muted hover:text-brand"
          >
            ← Dokumenti
          </Link>
          <h1 className="truncate font-medium text-fg">{row.title}</h1>
        </div>
        <p className="shrink-0 text-sm text-fg-muted">
          {row.kind === "pdf" && `${row.page_count} str. · `}
          {row.block_count} odlomaka
        </p>
      </header>

      {row.error_message && (
        <p className="shrink-0 border-b border-border bg-warning-bg px-4 py-2 text-sm text-warning-fg">
          {row.error_message}
        </p>
      )}

      {/* The reader gets the full width for now. Slice 3 puts the chat
          column beside it here, and a bottom sheet below `md`. */}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4">
        {row.kind === "pdf" ? (
          fileUrl ? (
            <PdfReader fileUrl={fileUrl} blocks={blocks} />
          ) : (
            <p className="py-4 text-sm text-fg-muted">
              Datoteka nije dostupna. Osvježi stranicu.
            </p>
          )
        ) : (
          <TextReader blocks={blocks} />
        )}
      </div>
    </div>
  );
}
