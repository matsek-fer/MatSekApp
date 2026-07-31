"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { hr } from "date-fns/locale";
import { createClient as createBrowserClient } from "@/lib/supabase/client";

const POLL_MS = 30_000;
const PREVIEW_LIMIT = 10;

interface NotificationItem {
  id: string;
  type: string;
  message: string;
  created_at: string;
  activity_id: string | null;
}

const TYPE_ICON: Record<string, string> = {
  approved: "✅",
  rejected: "❌",
};

export default function NotificationBell() {
  const supabase = useMemo(() => createBrowserClient(), []);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [total, setTotal] = useState(0);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const refresh = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;

    // The badge needs the true unread total, not the length of the preview
    // list — otherwise it can never show more than PREVIEW_LIMIT.
    const [{ data }, { count }] = await Promise.all([
      supabase
        .from("notifications")
        .select("id, type, message, created_at, activity_id")
        .eq("user_id", session.user.id)
        .eq("is_read", false)
        .order("created_at", { ascending: false })
        .limit(PREVIEW_LIMIT),
      supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", session.user.id)
        .eq("is_read", false),
    ]);

    setItems(data ?? []);
    setTotal(count ?? 0);
  }, [supabase]);

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
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);
    refresh();
  }

  async function markAllRead() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;

    setItems([]);
    setTotal(0);
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", session.user.id)
      .eq("is_read", false);
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
