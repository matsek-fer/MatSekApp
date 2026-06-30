import { createClient as createServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { hr } from "date-fns/locale";

export default async function NotificationsPage() {
  const supabase = createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return null;

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*, activity:activities(id, title, status)")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Notifikacije</h1>

      {!notifications || notifications.length === 0 ? (
        <p className="text-gray-500 text-center py-12">
          Nemaš notifikacija.
        </p>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`bg-white rounded-lg border p-4 ${
                !n.is_read ? "border-l-4 border-l-brand-500" : ""
              }`}
            >
              <p className="text-gray-900">{n.message}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-400">
                  {format(parseISO(n.created_at), "dd.MM.yyyy. HH:mm", {
                    locale: hr,
                  })}
                </span>
                {n.activity_id && (
                  <Link
                    href={`/activities/${n.activity_id}`}
                    className="text-sm text-brand-600 hover:underline"
                  >
                    Pogledaj aktivnost →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
