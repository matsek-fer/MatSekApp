"use client";

import { useLogout } from "@/hooks/useLogout";

export default function LogoutButton() {
  const { logout, loading } = useLogout();

  return (
    <button
      onClick={logout}
      disabled={loading}
      className="px-3 py-2 text-sm text-gray-500 hover:text-red-600
                 hover:bg-red-50 rounded-lg transition-colors
                 disabled:opacity-50 disabled:cursor-not-allowed"
      title="Odjavi se"
    >
      {loading ? "Odjava..." : "Odjavi se"}
    </button>
  );
}
