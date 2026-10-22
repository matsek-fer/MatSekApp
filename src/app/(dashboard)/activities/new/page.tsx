"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ACTIVITY_TYPE_LABELS } from "@/types";
import type { ActivityType, CreateActivityPayload } from "@/types";
import Card from "@/components/ui/Card";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Field";

const EMPTY_FORM: CreateActivityPayload = {
  title: "",
  activity_type: "lecture",
  start_time: "",
  end_time: "",
  location: "",
  description: "",
  prerequisites: "",
  target_audience: "",
};

export default function NewActivityPage() {
  const router = useRouter();
  const [form, setForm] = useState<CreateActivityPayload>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function update<K extends keyof CreateActivityPayload>(
    key: K,
    value: CreateActivityPayload[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.end_time <= form.start_time) {
      setError("Kraj aktivnosti mora biti nakon početka.");
      return;
    }

    setLoading(true);
    try {
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

      router.push("/profile");
      router.refresh();
    } catch {
      setError("Greška u vezi. Pokušaj ponovno.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-fg">Predloži novu aktivnost</h1>
        <p className="mt-1 text-sm text-fg-muted">
          Prijedlog ide administratoru na pregled prije objave u kalendaru.
        </p>
      </div>

      <Alert tone="error">{error}</Alert>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <Input
            label="Naslov"
            type="text"
            required
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
          />

          <Select
            label="Tip aktivnosti"
            value={form.activity_type}
            onChange={(e) => update("activity_type", e.target.value as ActivityType)}
          >
            {Object.entries(ACTIVITY_TYPE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </Select>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Početak"
              type="datetime-local"
              required
              value={form.start_time}
              onChange={(e) => update("start_time", e.target.value)}
            />
            <Input
              label="Kraj"
              type="datetime-local"
              required
              min={form.start_time || undefined}
              value={form.end_time}
              onChange={(e) => update("end_time", e.target.value)}
            />
          </div>

          <Input
            label="Lokacija / prostorija"
            type="text"
            required
            placeholder="npr. D1, Zavod za primijenjenu matematiku"
            value={form.location}
            onChange={(e) => update("location", e.target.value)}
          />

          <Textarea
            label="Opis"
            required
            rows={4}
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
          />

          <Input
            label="Preduvjeti"
            type="text"
            hint="Neobavezno."
            placeholder="npr. Matematička analiza 1"
            value={form.prerequisites}
            onChange={(e) => update("prerequisites", e.target.value)}
          />

          <Input
            label="Ciljana publika"
            type="text"
            hint="Neobavezno."
            placeholder="npr. studenti 1. i 2. godine"
            value={form.target_audience}
            onChange={(e) => update("target_audience", e.target.value)}
          />

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? "Šaljem…" : "Predloži aktivnost"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
