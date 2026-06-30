"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient as createBrowserClient } from "@/lib/supabase/client";
import type { Profile, UserRole } from "@/types";

/**
 * Hook: returns the current user's profile (role, full_name, etc.)
 */
export function useProfile() {
  const supabase = createBrowserClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      setProfile(data);
      setLoading(false);
    }
    load();
  }, [supabase]);

  return { profile, loading, isAdmin: profile?.role === "admin" };
}

/**
 * Hook: returns the number of unread notifications.
 */
export function useUnreadCount() {
  const supabase = createBrowserClient();
  const [count, setCount] = useState(0);

  const refresh = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;

    const { count: c } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", session.user.id)
      .eq("is_read", false);

    setCount(c || 0);
  }, [supabase]);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 30_000); // poll every 30s
    return () => clearInterval(interval);
  }, [refresh]);

  return { unreadCount: count, refresh };
}
