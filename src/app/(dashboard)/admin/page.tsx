import { createClient as createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { hr } from "date-fns/locale";
import type { ActivityType } from "@/types";
import { ACTIVITY_TYPE_LABELS } from "@/types";

export default async function AdminDashboardPage() {
  const supabase = createServerClient();

  // Verify admin
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  if (profile?.role !== "admin") redirect("/calendar");

  // Fetch pending activities
  const { data: pending } = await supabase
    .from("activities")
    .select("*, creator:profiles!created_by(id, email, full_name)")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Admin panel</h1>

      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-gray-900">
            Aktivnosti na čekanju ({pending?.length || 0})
          </h2>
        </div>

        {!pending || pending.length === 0 ? (
          <p className="p-4 text-gray-500">Nema aktivnosti na čekanju.</p>
        ) : (
          <div className="divide-y">
            {pending.map((a) => (
              <div
                key={a.id}
                className="p-4 flex justify-between items-start gap-4"
              >
                <div className="flex-1">
                  <Link
                    href={`/activities/${a.id}`}
                    className="font-medium text-gray-900 hover:text-brand-600"
                  >
                    {a.title}
                  </Link>
                  <p className="text-sm text-gray-500">
                    {ACTIVITY_TYPE_LABELS[a.activity_type as ActivityType]} •{" "}
                    {format(parseISO(a.start_time), "dd.MM.yyyy. HH:mm", {
                      locale: hr,
                    })}{" "}
                    • {a.location}
                  </p>
                  <p className="text-xs text-gray-400">
                    Predložio/la: {a.creator?.full_name || a.creator?.email}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Link
                    href={`/admin/review/${a.id}`}
                    className="px-3 py-1 text-sm bg-brand-600 text-white rounded-lg
                               hover:bg-brand-700 transition-colors"
                  >
                    Pregledaj
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
