import { requireAdmin } from "@/lib/auth/session";

/**
 * The admin check the middleware used to make. It moved here because the
 * middleware runs on the Edge runtime and cannot read the database; a layout
 * covers every page under /admin, including the client-rendered review page,
 * whose API calls are separately admin-checked anyway.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  return children;
}
