"use client";

import { useEffect, useRef } from "react";

/**
 * The floating "Pitaj" affordance over a selection.
 *
 * Reuses the two established idioms rather than inventing a third: it is
 * positioned like ActivityTimeline's floating panel — absolute against the
 * reader's own container, `left` clamped into [0, width - panel] from a
 * measured rect — and dismissed like NotificationBell's dropdown, a single
 * effect gated on `open` binding a document mousedown outside-test plus
 * Escape.
 *
 * Keyboard parity is not optional. Selecting with shift+arrows fires
 * `selectionchange` the same as a mouse drag, so the popover appears
 * identically; it sits immediately after the reader in DOM order so Tab
 * reaches it, Enter activates it, and Escape dismisses it with focus
 * returned to the reader.
 */

const PANEL_WIDTH = 176;

export interface PopoverPosition {
  /** Relative to the reader's scroll container. */
  left: number;
  top: number;
}

interface SelectionPopoverProps {
  open: boolean;
  position: PopoverPosition;
  containerWidth: number;
  quote: string;
  onAsk: () => void;
  onDismiss: () => void;
}

export default function SelectionPopover({
  open,
  position,
  containerWidth,
  quote,
  onAsk,
  onDismiss,
}: SelectionPopoverProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        onDismiss();
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onDismiss();
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onDismiss]);

  if (!open) return null;

  const left = Math.min(
    Math.max(position.left - PANEL_WIDTH / 2, 0),
    Math.max(0, containerWidth - PANEL_WIDTH)
  );

  return (
    <div
      ref={rootRef}
      role="toolbar"
      aria-label="Radnje nad odabranim tekstom"
      className="absolute z-20 animate-fade-in-up rounded-lg border border-border bg-surface p-1 shadow-lg"
      style={{ left, top: position.top, width: PANEL_WIDTH }}
    >
      <button
        type="button"
        onClick={onAsk}
        // mousedown would clear the selection before click fires; preventing
        // the default keeps the selected text visible under the popover.
        onMouseDown={(e) => e.preventDefault()}
        className="w-full rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-brand-fg hover:bg-brand-700 dark:hover:bg-brand-300"
      >
        Pitaj o odabranom
      </button>
      <p className="mt-1 max-w-full truncate px-1 text-xs text-fg-muted" aria-hidden>
        „{quote.slice(0, 60)}
        {quote.length > 60 ? "…" : ""}”
      </p>
    </div>
  );
}
