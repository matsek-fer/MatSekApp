"use client";

import { useLogout } from "@/hooks/useLogout";
import Button from "@/components/ui/Button";

export default function LogoutButton() {
  const { logout, loading } = useLogout();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={logout}
      disabled={loading}
      className="hover:bg-danger/10 hover:text-danger"
      title="Odjavi se"
    >
      {loading ? "Odjava…" : "Odjavi se"}
    </Button>
  );
}
