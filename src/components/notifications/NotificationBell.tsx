"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient as createBrowserClient } from "@/lib/supabase/client";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { hr } from "date-fns/locale";

interface NotificationItem {
  id: string;
  type: string;
  message: string;
  is_read: boolean;
  created_at: string;
  activity_id: string | null;
}

export default function NotificationBell() {
  const supabase = createBrowserClient();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [open, setOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const fetchNotifications = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;

    const { data } = await supabase
      .from("notifications")
      .select("id, type, message, is_read, created_at, activity_id")
      .eq("user_id", session.user.id)
      .eq("is_read", false)
      .order("created_at", { ascending: false })
      .limit(10);

    if (data) setNotifications(data);
  }, [supabase]);

  // Initial fetch + periodic poll
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30_000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [open]);

  async function markAsRead(notificationId: string) {
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId);

    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
    );
  }

  async function markAllRead() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;

    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", session.user.id)
      .eq("is_read", false);

    setNotifications([]);
  }

  function getTypeIcon(type: string) {
    switch (type) {
      case "approved":
        return "✅";
      case "rejected":
        return "❌";
      default:
        return "ℹ️";
    }
  }

  return (
    <div className="relative" ref={bellRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-gray-600 hover:text-brand-600 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Notifikacije"
      >
        {/* Bell SVG icon */}
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
        >
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 font-medium">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 animate-slide-in">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 text-sm">
              Notifikacije
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-brand-600 hover:text-brand-700 font-medium"
              >
                Označi sve pročitanim
              </button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-400 text-sm">
                <p>Nema novih notifikacija</p>
                <Link
                  href="/notifications"
                  onClick={() => setOpen(false)}
                  className="text-brand-600 hover:underline mt-1 inline-block"
                >
                  Pogledaj sve
                </Link>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                    !n.is_read ? "bg-brand-50/50" : ""
                  }`}
                >
                  <div className="flex gap-2">
                    <span className="text-sm mt-0.5">
                      {getTypeIcon(n.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {n.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {format(parseISO(n.created_at), "dd.MM. HH:mm", {
                          locale: hr,
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    {n.activity_id && (
                      <Link
                        href={`/activities/${n.activity_id}`}
                        onClick={() => {
                          markAsRead(n.id);
                          setOpen(false);
                        }}
                        className="text-xs text-brand-600 hover:text-brand-700 font-medium"
                      >
                        Više detalja →
                      </Link>
                    )}
                    {!n.is_read && (
                      <button
                        onClick={() => markAsRead(n.id)}
                        className="text-xs text-gray-400 hover:text-gray-600"
                      >
                        Označi pročitanim
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-100 text-center">
              <Link
                href="/notifications"
                onClick={() => setOpen(false)}
                className="text-sm text-brand-600 hover:text-brand-700 font-medium"
              >
                Pogledaj sve notifikacije →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
