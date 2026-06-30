"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { hr } from "date-fns/locale";
import { ACTIVITY_TYPE_LABELS, ACTIVITY_STATUS_LABELS } from "@/types";
import type { Activity } from "@/types";

export default function AdminReviewPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [denyComment, setDenyComment] = useState("");
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/activities/${params.id}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setActivity(json.data);
        else setError("Aktivnost nije pronađena.");
      })
      .catch(() => setError("Greška pri učitavanju."))
      .finally(() => setLoading(false));
  }, [params.id]);

  async function handleApprove() {
    setActionLoading("approve");
    const res = await fetch(`/api/activities/${params.id}/approve`, {
      method: "POST",
    });
    const json = await res.json();
    if (json.success) {
      router.push("/admin");
      router.refresh();
    } else {
      setError(json.error || "Greška.");
      setActionLoading("");
    }
  }

  async function handleDeny() {
    if (!denyComment.trim()) {
      setError("Unesi komentar za odbijanje.");
      return;
    }
    setActionLoading("deny");
    const res = await fetch(`/api/activities/${params.id}/deny`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ admin_comment: denyComment }),
    });
    const json = await res.json();
    if (json.success) {
      router.push("/admin");
      router.refresh();
    } else {
      setError(json.error || "Greška.");
      setActionLoading("");
    }
  }

  if (loading) {
    return <p className="text-gray-500">Učitavanje...</p>;
  }

  if (!activity) {
    return <p className="text-red-500">{error || "Aktivnost nije pronađena."}</p>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Pregled aktivnosti
      </h1>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg border p-6 space-y-4">
        <h2 className="text-xl font-semibold">{activity.title}</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Tip:</span>{" "}
            {ACTIVITY_TYPE_LABELS[activity.activity_type]}
          </div>
          <div>
            <span className="text-gray-500">Status:</span>{" "}
            {ACTIVITY_STATUS_LABELS[activity.status]}
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
          <h3 className="font-medium">Opis</h3>
          <p className="text-gray-600 whitespace-pre-wrap">
            {activity.description}
          </p>
        </div>
        {activity.prerequisites && (
          <div>
            <h3 className="font-medium">Preduvjeti</h3>
            <p className="text-gray-600">{activity.prerequisites}</p>
          </div>
        )}
        {activity.target_audience && (
          <div>
            <h3 className="font-medium">Ciljana publika</h3>
            <p className="text-gray-600">{activity.target_audience}</p>
          </div>
        )}
        <p className="text-xs text-gray-400">
          Predložio/la: {activity.creator?.full_name || activity.creator?.email}
        </p>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-lg border p-6 space-y-4">
        <h3 className="font-semibold">Administratorske akcije</h3>

        <button
          onClick={handleApprove}
          disabled={actionLoading === "approve" || activity.status !== "pending"}
          className="w-full py-2 bg-green-600 text-white rounded-lg
                     hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {actionLoading === "approve" ? "Odobravam..." : "✅ Odobri aktivnost"}
        </button>

        <div className="space-y-2">
          <textarea
            placeholder="Komentar za odbijanje (obavezno)..."
            rows={3}
            value={denyComment}
            onChange={(e) => setDenyComment(e.target.value)}
            disabled={activity.status !== "pending"}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
          <button
            onClick={handleDeny}
            disabled={actionLoading === "deny" || activity.status !== "pending"}
            className="w-full py-2 bg-red-600 text-white rounded-lg
                       hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {actionLoading === "deny" ? "Odbijam..." : "❌ Odbij aktivnost"}
          </button>
        </div>
      </div>
    </div>
  );
}
