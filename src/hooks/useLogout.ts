"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { postAuth } from "@/lib/auth/client";

/**
 * Hook: logout functionality.
 */
export function useLogout() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    await postAuth("logout", {});
    router.push("/");
    router.refresh();
  }

  return { logout, loading };
}
