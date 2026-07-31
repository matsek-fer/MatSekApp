"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { hr } from "date-fns/locale";
import { ACTIVITY_TYPE_LABELS } from "@/types";
import type { Activity } from "@/types";
import Card from "@/components/ui/Card";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Field";
import { StatusBadge } from "@/components/ui/Badge";

type Action = "approve" | "deny" | null;

export default function AdminReviewPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [pendingAction, setPendingAction] = useState<Action>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/activities/${params.id}`)
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        if (json.success) setActivity(json.data);
        else setError(json.error || "Aktivnost nije pronađena.");
      })
      .catch(() => !cancelled && setError("Greška pri učitavanju."))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [params.id]);

  const submit = useCallback(
    async (action: Exclude<Action, null>, body?: unknown) => {
      setError("");
      setPendingAction(action);
      try {
        const res = await fetch(`/api/activities/${params.id}/${action}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: body ? JSON.stringify(body) : undefined,
        });
        const json = await res.json();

        if (!json.success) {
          setError(json.error || "Greška.");
          setPendingAction(null);
          return;
        }

        router.push("/admin");
        router.refresh();
      } catch {
        setError("Greška u vezi. Pokušaj ponovno.");
        setPendingAction(null);
      }
    },
    [params.id, router]
  );

  function handleDeny() {
    if (!comment.trim()) {
      setError("Unesi komentar za odbijanje.");
      return;
    }
    submit("deny", { admin_comment: comment.trim() });
  }

  if (loading) {
    return <p className="text-fg-muted">Učitavanje…</p>;
  }

  if (!activity) {
    return <Alert tone="error">{error || "Aktivnost nije pronađena."}</Alert>;
  }

  const isPending = activity.status === "pending";
  const dateFmt = (iso: string) =>
    format(parseISO(iso), "dd.MM.yyyy. HH:mm", { locale: hr });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold text-fg">Pregled aktivnosti</h1>

      <Alert tone="error">{error}</Alert>

      <Card className="space-y-5 p-6">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-xl font-semibold text-fg">{activity.title}</h2>
          <StatusBadge status={activity.status} />
        </div>

        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-fg-subtle">Tip</dt>
            <dd className="text-fg">
              {ACTIVITY_TYPE_LABELS[activity.activity_type]}
            </dd>
          </div>
          <div>
            <dt className="text-fg-subtle">Lokacija</dt>
            <dd className="text-fg">{activity.location || "—"}</dd>
          </div>
          <div>
            <dt className="text-fg-subtle">Početak</dt>
            <dd className="text-fg">{dateFmt(activity.start_time)}</dd>
          </div>
          <div>
            <dt className="text-fg-subtle">Kraj</dt>
            <dd className="text-fg">{dateFmt(activity.end_time)}</dd>
          </div>
        </dl>

        <div>
          <h3 className="font-medium text-fg">Opis</h3>
          <p className="mt-1 whitespace-pre-wrap text-fg-muted">
            {activity.description}
          </p>
        </div>

        {activity.prerequisites && (
          <div>
            <h3 className="font-medium text-fg">Preduvjeti</h3>
            <p className="mt-1 text-fg-muted">{activity.prerequisites}</p>
          </div>
        )}

        {activity.target_audience && (
          <div>
            <h3 className="font-medium text-fg">Ciljana publika</h3>
            <p className="mt-1 text-fg-muted">{activity.target_audience}</p>
          </div>
        )}

        <p className="border-t border-border pt-4 text-xs text-fg-subtle">
          Predložio/la: {activity.creator?.full_name || activity.creator?.email}
        </p>
      </Card>

      <Card className="space-y-4 p-6">
        <h3 className="font-semibold text-fg">Administratorske akcije</h3>

        {!isPending && (
          <Alert tone="info">
            Ova aktivnost je već pregledana — akcije su onemogućene.
          </Alert>
        )}

        <Button
          variant="success"
          fullWidth
          onClick={() => submit("approve")}
          disabled={!isPending || pendingAction !== null}
        >
          {pendingAction === "approve" ? "Odobravam…" : "✅ Odobri aktivnost"}
        </Button>

        <div className="space-y-2">
          <Textarea
            label="Komentar za odbijanje"
            hint="Obavezno — šalje se autoru mailom."
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={!isPending || pendingAction !== null}
          />
          <Button
            variant="danger"
            fullWidth
            onClick={handleDeny}
            disabled={!isPending || pendingAction !== null}
          >
            {pendingAction === "deny" ? "Odbijam…" : "❌ Odbij aktivnost"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
