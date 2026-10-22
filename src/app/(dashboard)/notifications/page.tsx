import Link from "next/link";
import { redirect } from "next/navigation";
import { format, parseISO } from "date-fns";
import { hr } from "date-fns/locale";
import { createClient as createServerClient } from "@/lib/supabase/server";
import type { Notification } from "@/types";
import Card from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const supabase = createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) redirect("/login");

  const { data } = await supabase
    .from("notifications")
    .select("*, activity:activities(id, title, status)")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  const notifications = (data ?? []) as Notification[];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-fg">Notifikacije</h1>

      {notifications.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-fg-muted">Nemaš notifikacija.</p>
        </Card>
      ) : (
        <ul className="space-y-2">
          {notifications.map((n) => (
            <li key={n.id}>
              <Card
                className={cn(
                  "p-4",
                  !n.is_read && "border-l-4 border-l-brand"
                )}
              >
                <p className="text-fg">{n.message}</p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <time
                    dateTime={n.created_at}
                    className="text-xs text-fg-subtle"
                  >
                    {format(parseISO(n.created_at), "dd.MM.yyyy. HH:mm", {
                      locale: hr,
                    })}
                  </time>
                  {n.activity_id && (
                    <Link
                      href={`/activities/${n.activity_id}`}
                      className="text-sm text-brand hover:underline"
                    >
                      Pogledaj aktivnost →
                    </Link>
                  )}
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
