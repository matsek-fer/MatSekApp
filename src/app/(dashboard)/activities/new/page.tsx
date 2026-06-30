"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient as createBrowserClient } from "@/lib/supabase/client";
import type { CreateActivityPayload, ActivityType } from "@/types";
import { ACTIVITY_TYPE_LABELS } from "@/types";

export default function NewActivityPage() {
  const router = useRouter();
  const supabase = createBrowserClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<CreateActivityPayload>({
    title: "",
    activity_type: "lecture",
    start_time: "",
    end_time: "",
    location: "",
    description: "",
    prerequisites: "",
    target_audience: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/activities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const json = await res.json();
    if (!json.success) {
      setError(json.error || "Greška pri slanju.");
      setLoading(false);
      return;
    }

    router.push("/calendar");
    router.refresh();
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Predloži novu aktivnost
      </h1>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg border">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Naslov
          </label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2
                       focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>

        {/* Activity Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tip aktivnosti
          </label>
          <select
            value={form.activity_type}
            onChange={(e) =>
              setForm({ ...form, activity_type: e.target.value as ActivityType })
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          >
            {Object.entries(ACTIVITY_TYPE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Start / End time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Početak
            </label>
            <input
              type="datetime-local"
              required
              value={form.start_time}
              onChange={(e) => setForm({ ...form, start_time: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kraj
            </label>
            <input
              type="datetime-local"
              required
              value={form.end_time}
              onChange={(e) => setForm({ ...form, end_time: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lokacija / Prostorija
          </label>
          <input
            type="text"
            required
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Opis
          </label>
          <textarea
            required
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        {/* Prerequisites */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preduvjeti
          </label>
          <input
            type="text"
            value={form.prerequisites}
            onChange={(e) =>
              setForm({ ...form, prerequisites: e.target.value })
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        {/* Target audience */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ciljana publika
          </label>
          <input
            type="text"
            value={form.target_audience}
            onChange={(e) =>
              setForm({ ...form, target_audience: e.target.value })
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-brand-600 text-white rounded-lg
                     hover:bg-brand-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Šaljem..." : "Predloži aktivnost"}
        </button>
      </form>
    </div>
  );
}
