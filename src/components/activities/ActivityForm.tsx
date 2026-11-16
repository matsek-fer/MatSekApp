"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { createClient } from "@/lib/supabase/client";
import type { LibraryEntry } from "@/lib/materials-meta";
import { ACTIVITY_TYPE_LABELS, RESERVATION_STATUS_LABELS } from "@/types";
import type {
  Activity,
  ActivityMaterialInput,
  ActivityType,
  CreateActivityMaterialResult,
  CreateActivityPayload,
  ReservationStatus,
} from "@/types";
import { ACTIVITY_MATERIALS_BUCKET, formatBytes } from "@/lib/activity-materials";
import { ACTIVITY_REVIEWED_FIELDS } from "@/lib/validation";
import Card from "@/components/ui/Card";
import Alert from "@/components/ui/Alert";
import Button, { ButtonLink } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Field";
import ActivityMaterialsEditor, {
  type DraftMaterial,
} from "./ActivityMaterialsEditor";

type FormFields = Required<Omit<CreateActivityPayload, "materials">>;

const EMPTY_FORM: FormFields = {
  title: "",
  activity_type: "lecture",
  start_time: "",
  end_time: "",
  location: "",
  reservation_status: "not_sent",
  description: "",
  prerequisites: "",
  target_audience: "",
};

/** `datetime-local` holds wall-clock time with no zone: the member's own. */
const toLocalInput = (iso: string) =>
  format(parseISO(iso), "yyyy-MM-dd'T'HH:mm");

/**
 * …so the instant is fixed here, in the browser, where that zone is known.
 * Sent as typed, the string is read by Postgres in the database's zone —
 * UTC — and an activity entered for 18:00 is stored an hour or two late.
 */
const toInstant = (local: string) => new Date(local).toISOString();

function fieldsOf(a: Activity): FormFields {
  return {
    title: a.title.trim(),
    activity_type: a.activity_type,
    // Filled in after mount; see the effect in the component.
    start_time: "",
    end_time: "",
    location: a.location.trim(),
    reservation_status: a.reservation_status,
    description: a.description,
    prerequisites: a.prerequisites,
    target_audience: a.target_audience,
  };
}

function draftsOf(a: Activity): DraftMaterial[] {
  return [...(a.materials ?? [])]
    .sort(
      (x, y) =>
        x.position - y.position || x.created_at.localeCompare(y.created_at)
    )
    .map((m) => ({
      key: m.id,
      id: m.id,
      phase: m.phase,
      kind: m.kind,
      title: m.title,
      url: m.url,
      note: m.note,
      file: null,
      fileLabel:
        m.kind === "file"
          ? `${m.file_name} · ${formatBytes(m.byte_size)}`
          : undefined,
    }));
}

/**
 * The activity form: a new proposal, or — given `activity` — an edit of one.
 *
 * Submit is several steps because a file's storage path needs the activity's
 * id. A proposal goes up first with its link and library materials in the
 * same body; an edit sends only the fields that changed, then removes the
 * materials taken off the list and adds the new ones. Either way each file
 * is then reserved on the materials route and PUT straight to Storage. A
 * material that fails is reported with a link to the activity — which by
 * then exists, or is saved — rather than silently missing.
 *
 * What an edit of an approved activity costs is the database's decision
 * (the `settle_member_edit` trigger): a new time, place or type takes it
 * off the calendar until an admin approves it again. `needsReview` only
 * makes the form say so before the member saves.
 */
export default function ActivityForm({
  library,
  libraryAvailable,
  activity,
  needsReview = false,
}: {
  library: LibraryEntry[];
  libraryAvailable: boolean;
  /** The activity being edited, with its materials; absent for a proposal. */
  activity?: Activity;
  /** Its author is editing an approved activity. */
  needsReview?: boolean;
}) {
  const router = useRouter();
  /** The fields as the database has them — what an edit is compared against. */
  const [saved, setSaved] = useState<FormFields>(() =>
    activity ? fieldsOf(activity) : EMPTY_FORM
  );
  const [form, setForm] = useState<FormFields>(saved);
  const [materials, setMaterials] = useState<DraftMaterial[]>(() =>
    activity ? draftsOf(activity) : []
  );
  const [stage, setStage] = useState<string | null>(null);
  /** Saved, but not all of it: the form is closed so a retry cannot double up. */
  const [settled, setSettled] = useState(false);
  const [error, setError] = useState<React.ReactNode>("");

  // The stored instants become wall-clock strings only in the browser. Done
  // while rendering they would be the server's zone on the server and the
  // member's on hydration, and the inputs would be left showing one while
  // the state held the other.
  const savedStart = activity?.start_time;
  const savedEnd = activity?.end_time;
  useEffect(() => {
    if (!savedStart || !savedEnd) return;
    const times = {
      start_time: toLocalInput(savedStart),
      end_time: toLocalInput(savedEnd),
    };
    setForm((prev) => ({ ...prev, ...times }));
    setSaved((prev) => ({ ...prev, ...times }));
  }, [savedStart, savedEnd]);

  function update<K extends keyof FormFields>(key: K, value: FormFields[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  /** The form as it will be sent: stray spaces are not an edit. */
  const current: FormFields = {
    ...form,
    title: form.title.trim(),
    location: form.location.trim(),
  };
  const reviewedChanged =
    needsReview &&
    ACTIVITY_REVIEWED_FIELDS.some((key) => current[key] !== saved[key]);

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
    const added = materials.filter((d) => !d.id);
    const inline: ActivityMaterialInput[] = added
      .filter((d) => d.kind !== "file")
      .map((d) => ({
        phase: d.phase,
        kind: d.kind,
        title: d.title,
        url: d.url,
        note: d.note,
        position: pos.get(d.key),
      }));
    const files = added.filter((d) => d.kind === "file" && d.file);
    const jsonHeaders = { "Content-Type": "application/json" };

    setStage(activity ? "Spremam…" : "Šaljem…");
    try {
      const failures: string[] = [];
      let activityId: string;

      if (!activity) {
        const res = await fetch("/api/activities", {
          method: "POST",
          headers: jsonHeaders,
          body: JSON.stringify({
            ...current,
            start_time: toInstant(current.start_time),
            end_time: toInstant(current.end_time),
            materials: inline,
          }),
        });
        const body = await res.json();

        if (!body.success) {
          setError(body.error || "Greška pri slanju.");
          setStage(null);
          return;
        }
        activityId = body.data.id;
      } else {
        activityId = activity.id;

        // Only what changed is sent. An untouched time in particular must
        // not go back up: the input drops seconds, and the difference would
        // read as a new time and send an approved activity back for review.
        const patch: Record<string, string> = {};
        for (const key of Object.keys(current) as (keyof FormFields)[]) {
          if (current[key] === saved[key]) continue;
          patch[key] =
            key === "start_time" || key === "end_time"
              ? toInstant(current[key])
              : current[key];
        }
        if (Object.keys(patch).length > 0) {
          const res = await fetch(`/api/activities/${activityId}`, {
            method: "PATCH",
            headers: jsonHeaders,
            body: JSON.stringify(patch),
          });
          const body = await res.json();

          if (!body.success) {
            setError(body.error || "Greška pri spremanju.");
            setStage(null);
            return;
          }
        }

        // Removals before additions, so a full list has room for what
        // replaces them.
        const kept = new Set(materials.map((d) => d.id));
        for (const m of activity.materials ?? []) {
          if (kept.has(m.id)) continue;
          const res = await fetch(
            `/api/activities/${activityId}/materials/${m.id}`,
            { method: "DELETE" }
          );
          const body = await res.json();
          if (!body.success) {
            failures.push(`${m.title} (uklanjanje nije uspjelo)`);
          }
        }
        for (const m of inline) {
          const res = await fetch(`/api/activities/${activityId}/materials`, {
            method: "POST",
            headers: jsonHeaders,
            body: JSON.stringify(m),
          });
          const body = await res.json();
          if (!body.success) {
            failures.push(`${m.title} (${body.error || "greška"})`);
          }
        }
      }

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
          headers: jsonHeaders,
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
            {activity
              ? "Izmjene su spremljene, osim ovih materijala: "
              : "Aktivnost je predložena, ali ove datoteke nisu učitane: "}
            {failures.join(", ")}.{" "}
            <Link href={`/activities/${activityId}`} className="underline">
              Otvori aktivnost
            </Link>
            .
          </>
        );
        setSettled(true);
        setStage(null);
        return;
      }

      router.push(activity ? `/activities/${activityId}` : "/profile");
      router.refresh();
    } catch {
      setError("Greška u vezi. Pokušaj ponovno.");
      setStage(null);
    }
  }

  const busy = stage !== null || settled;
  const submitLabel = !activity
    ? "Predloži aktivnost"
    : reviewedChanged
      ? "Spremi i pošalji na odobrenje"
      : "Spremi izmjene";

  return (
    <>
      <Alert tone="error">{error}</Alert>

      {needsReview && (
        <Alert tone={reviewedChanged ? "warning" : "info"}>
          {reviewedChanged
            ? "Mijenjaš termin, mjesto ili vrstu: kad spremiš, aktivnost se povlači s kalendara dok je administrator ponovno ne odobri."
            : "Aktivnost je objavljena. Opis, preduvjete, materijale i rezervaciju možeš mijenjati odmah; promjena termina, mjesta ili vrste šalje je ponovno administratoru na odobrenje."}
        </Alert>
      )}

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

          <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
            <Input
              label="Lokacija / prostorija"
              type="text"
              required
              placeholder="npr. D1, Zavod za primijenjenu matematiku"
              value={form.location}
              onChange={(e) => update("location", e.target.value)}
            />
            <Select
              label="Rezervacija prostorije"
              value={form.reservation_status}
              onChange={(e) =>
                update("reservation_status", e.target.value as ReservationStatus)
              }
            >
              {Object.entries(RESERVATION_STATUS_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </Select>
          </div>

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
            libraryAvailable={libraryAvailable}
            value={materials}
            onChange={setMaterials}
            disabled={busy}
          />

          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            {activity && (
              <ButtonLink
                href={`/activities/${activity.id}`}
                variant="secondary"
                className="sm:flex-1"
              >
                Odustani
              </ButtonLink>
            )}
            <Button
              type="submit"
              fullWidth={!activity}
              className="sm:flex-1"
              disabled={busy}
            >
              {stage ?? submitLabel}
            </Button>
          </div>
        </form>
      </Card>
    </>
  );
}
