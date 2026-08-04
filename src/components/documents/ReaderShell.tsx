"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import PdfReader from "@/components/documents/PdfReader";
import TextReader from "@/components/documents/TextReader";
import ChatPanel from "@/components/documents/ChatPanel";
import SelectionPopover, {
  type PopoverPosition,
} from "@/components/documents/SelectionPopover";
import {
  anchorFromSelection,
  type SelectionAnchor,
} from "@/lib/documents/selection";
import type { DocumentBlock, Document as DocumentRow } from "@/types";

/**
 * The reading workspace, and the one place that escapes the dashboard shell.
 *
 * The reader needs its own scroll container pinned under the navbar, which
 * `(dashboard)/layout.tsx` does not offer: it is `min-h-screen` with a padded
 * `max-w-7xl` main, and under `md` an extra nav row makes the bar taller than
 * 4rem. So a hardcoded `calc(100dvh - 4rem)` would be wrong on exactly the
 * screens where it matters most. Instead the navbar is MEASURED — read on
 * layout, kept current by a ResizeObserver, the ActivityTimeline idiom.
 *
 * `z-30` deliberately sits under the navbar's `z-40`, so the navbar stays
 * usable while reading, and under the `z-50` dropdown and modal tier.
 *
 * At `md+` the chat is a column behind a draggable splitter; below `md` a
 * PDF and a chat side by side are unusable, so the reader takes the full
 * width and the chat becomes a bottom sheet in the ActivityTimeline modal
 * idiom. One breakpoint decides which of the two containers mounts.
 */

const FALLBACK_TOP = 64;

/** Reader's share of the width. Clamped hard — neither pane may vanish. */
const SPLIT_KEY = "matsek:reader-split";
const SPLIT_MIN = 0.3;
const SPLIT_MAX = 0.7;
const SPLIT_DEFAULT = 0.6;
const SPLIT_STEP = 0.05;

function clampSplit(value: number): number {
  return Math.min(SPLIT_MAX, Math.max(SPLIT_MIN, value));
}

interface ReaderShellProps {
  document: DocumentRow;
  blocks: DocumentBlock[];
  fileUrl: string | null;
}

export default function ReaderShell({
  document: row,
  blocks,
  fileUrl,
}: ReaderShellProps) {
  const [top, setTop] = useState(FALLBACK_TOP);
  const [isDesktop, setIsDesktop] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);

  const [split, setSplit] = useState(SPLIT_DEFAULT);
  const splitRef = useRef<HTMLDivElement>(null);

  const readerRef = useRef<HTMLDivElement>(null);
  const [popover, setPopover] = useState<{
    anchor: SelectionAnchor;
    position: PopoverPosition;
  } | null>(null);
  const [pendingAnchor, setPendingAnchor] = useState<SelectionAnchor | null>(
    null
  );
  const selectionTimer = useRef<ReturnType<typeof setTimeout>>();

  useLayoutEffect(() => {
    const navbar = window.document.getElementById("app-navbar");
    if (!navbar) return;

    const measure = () => setTop(navbar.offsetHeight);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(navbar);
    return () => observer.disconnect();
  }, []);

  // Matches Tailwind's `md`. Which side of it we are on decides whether the
  // chat mounts as a column or as a sheet.
  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  // The page behind a fixed, full-height reader must not scroll as well.
  // Restores the previous value so leaving cannot strand the body locked.
  useEffect(() => {
    const body = window.document.body;
    const previous = body.style.overflow;
    body.style.overflow = "hidden";
    return () => {
      body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    const stored = Number(window.localStorage.getItem(SPLIT_KEY));
    if (Number.isFinite(stored) && stored > 0) setSplit(clampSplit(stored));
  }, []);

  const applySplit = useCallback((value: number) => {
    const clamped = clampSplit(value);
    setSplit(clamped);
    window.localStorage.setItem(SPLIT_KEY, String(clamped));
  }, []);

  // Selection → popover. `selectionchange` fires continuously through a
  // drag, so the anchor is computed once the selection has been still for a
  // moment. Shift+arrow selection arrives through the same event, which is
  // what makes the popover reachable without a mouse.
  useEffect(() => {
    function onSelectionChange() {
      clearTimeout(selectionTimer.current);
      selectionTimer.current = setTimeout(() => {
        const container = readerRef.current;
        if (!container) return;

        const selection = window.getSelection();
        const anchor = anchorFromSelection(selection, container);

        if (!anchor) {
          setPopover(null);
          return;
        }

        const range = selection!.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        setPopover({
          anchor,
          position: {
            left: rect.left + rect.width / 2 - containerRect.left,
            // Inside the scroll content, so it scrolls with the text.
            top: rect.bottom - containerRect.top + container.scrollTop + 8,
          },
        });
      }, 150);
    }

    window.document.addEventListener("selectionchange", onSelectionChange);
    return () => {
      clearTimeout(selectionTimer.current);
      window.document.removeEventListener("selectionchange", onSelectionChange);
    };
  }, []);

  const ask = useCallback(() => {
    if (!popover) return;
    setPendingAnchor(popover.anchor);
    setPopover(null);
    if (!isDesktop) setSheetOpen(true);
  }, [popover, isDesktop]);

  const onSplitterKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        applySplit(split - SPLIT_STEP);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        applySplit(split + SPLIT_STEP);
      }
    },
    [split, applySplit]
  );

  const onSplitterPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      const content = splitRef.current;
      if (!content) return;
      const rect = content.getBoundingClientRect();

      function onMove(event: PointerEvent) {
        applySplit((event.clientX - rect.left) / rect.width);
      }
      function onUp() {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      }

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [applySplit]
  );

  const chatPanel = (
    <ChatPanel
      documentId={row.id}
      pendingAnchor={pendingAnchor}
      onAnchorConsumed={() => setPendingAnchor(null)}
    />
  );

  const readerContent = (
    <div ref={readerRef} className="relative h-full overflow-y-auto overscroll-contain px-4">
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

      <SelectionPopover
        open={popover !== null}
        position={popover?.position ?? { left: 0, top: 0 }}
        containerWidth={readerRef.current?.clientWidth ?? 0}
        quote={popover?.anchor.quote ?? ""}
        onAsk={ask}
        onDismiss={() => setPopover(null)}
      />
    </div>
  );

  return (
    <div
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
        <div className="flex shrink-0 items-center gap-3">
          <p className="text-sm text-fg-muted">
            {row.kind === "pdf" && `${row.page_count} str. · `}
            {row.block_count} odlomaka
          </p>
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="rounded-lg border border-border px-3 py-1.5 text-sm text-fg hover:bg-surface-hover md:hidden"
          >
            Razgovor
          </button>
        </div>
      </header>

      {row.error_message && (
        <p className="shrink-0 border-b border-border bg-warning-bg px-4 py-2 text-sm text-warning-fg">
          {row.error_message}
        </p>
      )}

      {isDesktop ? (
        <div ref={splitRef} className="flex min-h-0 flex-1">
          <div style={{ width: `${split * 100}%` }} className="min-h-0">
            {readerContent}
          </div>

          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Razdjelnik čitača i razgovora"
            tabIndex={0}
            onPointerDown={onSplitterPointerDown}
            onKeyDown={onSplitterKeyDown}
            className="w-1 shrink-0 cursor-col-resize bg-border transition-colors hover:bg-brand focus-visible:bg-brand focus-visible:outline-none"
          />

          <div className="min-h-0 flex-1 border-l border-border">
            {chatPanel}
          </div>
        </div>
      ) : (
        <>
          <div className="min-h-0 flex-1">{readerContent}</div>

          {/* The ActivityTimeline modal idiom: scrim closes, panel stops
              propagation, dialog semantics for the sheet. */}
          {sheetOpen && (
            <div
              className="fixed inset-0 z-50 flex items-end bg-black/60"
              onClick={() => setSheetOpen(false)}
            >
              <div
                role="dialog"
                aria-modal="true"
                aria-label="Razgovor o dokumentu"
                onClick={(e) => e.stopPropagation()}
                className="flex max-h-[80dvh] w-full flex-col rounded-t-xl border-t border-border bg-bg"
              >
                <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-2">
                  <h2 className="text-sm font-medium text-fg">Razgovor</h2>
                  <button
                    type="button"
                    onClick={() => setSheetOpen(false)}
                    aria-label="Zatvori razgovor"
                    className="rounded-md px-2 py-1 text-fg-muted hover:bg-surface-hover"
                  >
                    ×
                  </button>
                </div>
                <div className="min-h-0 flex-1">{chatPanel}</div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
