"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { LibraryEntry } from "@/lib/materials-meta";
import { ACTIVITY_TYPE_LABELS } from "@/types";
import type {
  ActivityMaterialInput,
  ActivityType,
  CreateActivityMaterialResult,
  CreateActivityPayload,
} from "@/types";
import { ACTIVITY_MATERIALS_BUCKET } from "@/lib/activity-materials";
import Card from "@/components/ui/Card";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Field";
import ActivityMaterialsEditor, {
  type DraftMaterial,
} from "./ActivityMaterialsEditor";

type FormFields = Omit<CreateActivityPayload, "materials">;

const EMPTY_FORM: FormFields = {
  title: "",
  activity_type: "lecture",
  start_time: "",
  end_time: "",
  location: "",
  description: "",
  prerequisites: "",
  target_audience: "",
};

/**
 * The proposal form.
 *
 * Submit is two steps because a file's storage path needs the activity's
 * id: the activity goes up first with its link and library materials in the
 * same body, then each file is reserved on the materials route and PUT
 * straight to Storage. A file that fails is withdrawn again, and the
 * proposal — which by then exists — is reported with a link rather than
 * silently missing a document.
 */
export default function NewActivityForm({ library }: { library: LibraryEntry[] }) {
  const router = useRouter();
  const [form, setForm] = useState<FormFields>(EMPTY_FORM);
  const [materials, setMaterials] = useState<DraftMaterial[]>([]);
  const [stage, setStage] = useState<string | null>(null);
  const [error, setError] = useState<React.ReactNode>("");

  function update<K extends keyof FormFields>(key: K, value: FormFields[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  /** Order within a phase, so the two lists keep the order they were built in. */
  function positions(): Map<string, number> {
    const counters = { before: 0, during: 0 };
    const out = new Map<string, number>();
    for (const d of materials) out.set(d.key, counters[d.phase]++);
    return out;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.end_time <= form.start_time) {
      setError("Kraj aktivnosti mora biti nakon početka.");
      return;
    }

    const pos = positions();
    const inline: ActivityMaterialInput[] = materials
      .filter((d) => d.kind !== "file")
      .map((d) => ({
        phase: d.phase,
        kind: d.kind,
        title: d.title,
        url: d.url,
        note: d.note,
        position: pos.get(d.key),
      }));
    const files = materials.filter((d) => d.kind === "file" && d.file);

    setStage("Šaljem…");
    try {
      const res = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, materials: inline }),
      });
      const json = await res.json();

      if (!json.success) {
        setError(json.error || "Greška pri slanju.");
        setStage(null);
        return;
      }

      const activityId: string = json.data.id;
      const failures: string[] = [];
      const supabase = createClient();

      for (let i = 0; i < files.length; i++) {
        const d = files[i];
        const file = d.file!;
        setStage(`Učitavam datoteku ${i + 1}/${files.length}…`);

        const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
        const contentType =
          extension === "pdf"
            ? "application/pdf"
            : extension === "txt"
              ? "text/plain"
              : "text/markdown";

        const reserveRes = await fetch(`/api/activities/${activityId}/materials`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phase: d.phase,
            kind: "file",
            title: d.title,
            position: pos.get(d.key),
            file_name: file.name,
            content_type: contentType,
            byte_size: file.size,
          } satisfies ActivityMaterialInput),
        });
        const reserveJson = await reserveRes.json();
        if (!reserveJson.success) {
          failures.push(`${d.title} (${reserveJson.error || "greška"})`);
          continue;
        }

        const reserved = reserveJson.data as CreateActivityMaterialResult;
        const { error: uploadError } = await supabase.storage
          .from(ACTIVITY_MATERIALS_BUCKET)
          .uploadToSignedUrl(
            reserved.material.storage_path,
            reserved.upload_token ?? "",
            file,
            { contentType }
          );

        if (uploadError) {
          await fetch(
            `/api/activities/${activityId}/materials/${reserved.material.id}`,
            { method: "DELETE" }
          );
          failures.push(`${d.title} (učitavanje nije uspjelo)`);
        }
      }

      if (failures.length > 0) {
        setError(
          <>
            Aktivnost je predložena, ali ove datoteke nisu učitane:{" "}
            {failures.join(", ")}.{" "}
            <Link href={`/activities/${activityId}`} className="underline">
              Otvori aktivnost
            </Link>
            .
          </>
        );
        setStage(null);
        return;
      }

      router.push("/profile");
      router.refresh();
    } catch {
      setError("Greška u vezi. Pokušaj ponovno.");
      setStage(null);
    }
  }

  const busy = stage !== null;

  return (
    <>
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

          <ActivityMaterialsEditor
            library={library}
            value={materials}
            onChange={setMaterials}
            disabled={busy}
          />

          <Button type="submit" fullWidth disabled={busy}>
            {busy ? stage : "Predloži aktivnost"}
          </Button>
        </form>
      </Card>
    </>
  );
}
