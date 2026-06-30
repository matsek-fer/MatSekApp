import { createClient as createServerClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { format, parseISO } from "date-fns";
import { hr } from "date-fns/locale";
import type { ActivityStatus, ActivityType } from "@/types";
import {
  ACTIVITY_TYPE_LABELS,
  ACTIVITY_STATUS_LABELS,
  ACTIVITY_STATUS_COLORS,
} from "@/types";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ActivityDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createServerClient();
  const { id } = params;

  const { data: activity } = await supabase
    .from("activities")
    .select("*, creator:profiles!created_by(id, email, full_name)")
    .eq("id", id)
    .single();

  if (!activity) {
    notFound();
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isOwner = session?.user.id === activity.created_by;
  const isPending = activity.status === "pending";
  const status = activity.status as ActivityStatus;
  const type = activity.activity_type as ActivityType;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        href="/calendar"
        className="text-brand-600 hover:underline text-sm"
      >
        ← Natrag na kalendar
      </Link>

      <div className="bg-white rounded-lg border p-6 space-y-4">
        <div className="flex justify-between items-start">
          <h1 className="text-2xl font-bold text-gray-900">
            {activity.title}
          </h1>
          <span
            className={`text-sm px-3 py-1 rounded-full ${ACTIVITY_STATUS_COLORS[status]}`}
          >
            {ACTIVITY_STATUS_LABELS[status]}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Tip:</span>{" "}
            {ACTIVITY_TYPE_LABELS[type]}
          </div>
          <div>
            <span className="text-gray-500">Lokacija:</span> {activity.location}
          </div>
          <div>
            <span className="text-gray-500">Početak:</span>{" "}
            {format(parseISO(activity.start_time), "dd.MM.yyyy. HH:mm", {
              locale: hr,
            })}
          </div>
          <div>
            <span className="text-gray-500">Kraj:</span>{" "}
            {format(parseISO(activity.end_time), "dd.MM.yyyy. HH:mm", {
              locale: hr,
            })}
          </div>
        </div>

        <div>
          <h3 className="font-medium text-gray-900">Opis</h3>
          <p className="text-gray-600 mt-1 whitespace-pre-wrap">
            {activity.description}
          </p>
        </div>

        {activity.prerequisites && (
          <div>
            <h3 className="font-medium text-gray-900">Preduvjeti</h3>
            <p className="text-gray-600 mt-1">{activity.prerequisites}</p>
          </div>
        )}

        {activity.target_audience && (
          <div>
            <h3 className="font-medium text-gray-900">Ciljana publika</h3>
            <p className="text-gray-600 mt-1">{activity.target_audience}</p>
          </div>
        )}

        {activity.admin_comment && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-medium text-red-800">Komentar admina</h3>
            <p className="text-red-700 mt-1">{activity.admin_comment}</p>
          </div>
        )}

        <div className="text-xs text-gray-400 pt-4 border-t">
          Predložio/la: {activity.creator?.full_name || activity.creator?.email}
        </div>
      </div>
    </div>
  );
}
