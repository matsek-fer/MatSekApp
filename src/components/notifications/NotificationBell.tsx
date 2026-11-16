"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { hr } from "date-fns/locale";
import type { UnreadSummary } from "@/app/api/notifications/unread/route";

const POLL_MS = 30_000;

type NotificationItem = UnreadSummary["items"][number];

const TYPE_ICON: Record<string, string> = {
  approved: "✅",
  rejected: "❌",
  edited: "✏️",
};

function markRead(body: { notification_ids: string[] } | { mark_all_read: true }) {
  return fetch("/api/notifications", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).catch(() => undefined);
}

export default function NotificationBell() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [total, setTotal] = useState(0);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications/unread", { cache: "no-store" });
      // 401 once the session lapses; the bell just stops updating.
      if (!res.ok) return;
      const json = await res.json();
      if (!json.success) return;
      const summary = json.data as UnreadSummary;
      setItems(summary.items);
      setTotal(summary.total);
    } catch {
      // Offline for a poll or two — the next one catches up.
    }
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, POLL_MS);
    return () => clearInterval(interval);
  }, [refresh]);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  async function markAsRead(id: string) {
    // The list only holds unread items, so a read one leaves it entirely.
    setItems((prev) => prev.filter((n) => n.id !== id));
    setTotal((prev) => Math.max(0, prev - 1));
    await markRead({ notification_ids: [id] });
    refresh();
  }

  async function markAllRead() {
    setItems([]);
    setTotal(0);
    await markRead({ mark_all_read: true });
  }

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative rounded-lg p-2 text-fg-muted transition-colors
                   hover:bg-surface-hover hover:text-fg"
        aria-label={
          total > 0 ? `Notifikacije (${total} nepročitanih)` : "Notifikacije"
        }
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>

        {total > 0 && (
          <span
            className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px]
                       items-center justify-center rounded-full bg-danger px-1
                       text-xs font-medium text-white"
          >
            {total > 9 ? "9+" : total}
          </span>
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-80 origin-top-right animate-fade-in-up
                     overflow-hidden rounded-xl border border-border bg-surface shadow-lg"
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h3 className="text-sm font-semibold text-fg">Notifikacije</h3>
            {total > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="text-xs font-medium text-brand hover:underline"
              >
                Označi sve pročitanim
              </button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-fg-subtle">
                Nema novih notifikacija
              </p>
            ) : (
              items.map((n) => (
                <div
                  key={n.id}
                  className="border-b border-border px-4 py-3 last:border-b-0
                             transition-colors hover:bg-surface-hover"
                >
                  <div className="flex gap-2">
                    <span aria-hidden="true" className="mt-0.5 text-sm">
                      {TYPE_ICON[n.type] ?? "ℹ️"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm text-fg">{n.message}</p>
                      <p className="mt-1 text-xs text-fg-subtle">
                        {format(parseISO(n.created_at), "dd.MM. HH:mm", {
                          locale: hr,
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2 flex gap-3">
                    {n.activity_id && (
                      <Link
                        href={`/activities/${n.activity_id}`}
                        onClick={() => {
                          markAsRead(n.id);
                          setOpen(false);
                        }}
                        className="text-xs font-medium text-brand hover:underline"
                      >
                        Više detalja →
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => markAsRead(n.id)}
                      className="text-xs text-fg-subtle hover:text-fg"
                    >
                      Označi pročitanim
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-border px-4 py-2 text-center">
            <Link
              href="/notifications"
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-brand hover:underline"
            >
              Pogledaj sve notifikacije →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
