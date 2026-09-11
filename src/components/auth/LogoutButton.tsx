"use client";

import { useLogout } from "@/hooks/useLogout";
import Button from "@/components/ui/Button";

export default function LogoutButton({
  label = "Odjavi se",
  pendingLabel = "Odjava…",
}: {
  label?: string;
  pendingLabel?: string;
}) {
  const { logout, loading } = useLogout();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={logout}
      disabled={loading}
      className="hover:bg-danger/10 hover:text-danger"
      title={label}
    >
      {loading ? pendingLabel : label}
    </Button>
  );
}
