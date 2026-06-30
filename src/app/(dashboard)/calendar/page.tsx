import { createClient as createServerClient } from "@/lib/supabase/server";
import type { Activity, ActivityType } from "@/types";
import {
  ACTIVITY_TYPE_LABELS,
  ACTIVITY_STATUS_COLORS,
  ACTIVITY_STATUS_LABELS,
} from "@/types";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { hr } from "date-fns/locale";

export default async function CalendarPage() {
  const supabase = createServerClient();

  const { data: activities } = await supabase
    .from("activities")
    .select("*, creator:profiles!created_by(id, email, full_name)")
    .eq("status", "approved")
    .order("start_time", { ascending: true });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const upcoming = (activities || []).slice(0, 20);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Kalendar aktivnosti
        </h1>
        {session && (
          <Link
            href="/activities/new"
            className="px-4 py-2 bg-brand-600 text-white rounded-lg
                       hover:bg-brand-700 transition-colors"
          >
            + Predloži aktivnost
          </Link>
        )}
      </div>

      {upcoming.length === 0 ? (
        <p className="text-gray-500 text-center py-12">
          Još nema odobrenih aktivnosti.
        </p>
      ) : (
        <div className="grid gap-4">
          {upcoming.map((activity: Activity) => (
            <Link
              key={activity.id}
              href={`/activities/${activity.id}`}
              className="block bg-white rounded-lg border border-gray-200 p-4
                         hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {activity.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {format(parseISO(activity.start_time), "EEEE, dd.MM.yyyy.", {
                      locale: hr,
                    })}{" "}
                    {format(parseISO(activity.start_time), "HH:mm")} –{" "}
                    {format(parseISO(activity.end_time), "HH:mm")}
                  </p>
                  <p className="text-sm text-gray-500">
                    📍 {activity.location}
                  </p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-brand-100 text-brand-700">
                  {ACTIVITY_TYPE_LABELS[activity.activity_type as ActivityType]}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
