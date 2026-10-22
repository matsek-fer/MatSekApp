"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { hr } from "date-fns/locale";
import {
  DOCUMENT_KIND_LABELS,
  DOCUMENT_STATUS_LABELS,
  type Document,
  type DocumentStatus,
} from "@/types";
import Alert from "@/components/ui/Alert";
import Badge, { type BadgeTone } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

const STATUS_TONES: Record<DocumentStatus, BadgeTone> = {
  uploading: "neutral",
  extracting: "warning",
  ready: "success",
  failed: "danger",
};

export default function DocumentList({ documents }: { documents: Document[] }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  async function handleRetry(id: string, force = false) {
    if (
      force &&
      !window.confirm(
        "Ponovna obrada može poboljšati raspored teksta, ali postojeći citati u razgovorima mogu zastarjeti. Nastaviti?"
      )
    ) {
      return;
    }

    setError("");
    setBusyId(id);
    try {
      const res = await fetch(
        `/api/documents/${id}/ingest${force ? "?force=1" : ""}`,
        { method: "POST" }
      );
      const json = await res.json();
      if (!json.success) setError(json.error || "Obrada nije uspjela.");
      router.refresh();
    } catch {
      setError("Greška pri obradi dokumenta.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!window.confirm(`Obrisati „${title}”? Ovo se ne može poništiti.`)) {
      return;
    }

    setError("");
    setBusyId(id);
    try {
      const res = await fetch(`/api/documents/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) setError(json.error || "Dokument nije obrisan.");
      router.refresh();
    } catch {
      setError("Greška pri brisanju dokumenta.");
    } finally {
      setBusyId(null);
    }
  }

  if (documents.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-sm text-fg-muted">
          Još nemaš dokumenata. Učitaj skripta ili bilješke da ih možeš čitati
          uz pomoć asistenta.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <Alert tone="error">{error}</Alert>

      {documents.map((document) => (
        <Card key={document.id} className="p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                {document.status === "ready" ? (
                  <Link
                    href={`/documents/${document.id}`}
                    className="truncate font-medium text-fg hover:text-brand"
                  >
                    {document.title}
                  </Link>
                ) : (
                  <span className="truncate font-medium text-fg">
                    {document.title}
                  </span>
                )}
                <Badge tone={STATUS_TONES[document.status]}>
                  {DOCUMENT_STATUS_LABELS[document.status]}
                </Badge>
              </div>

              <p className="mt-1 text-sm text-fg-muted">
                {DOCUMENT_KIND_LABELS[document.kind]}
                {document.status === "ready" && (
                  <>
                    {document.kind === "pdf" && ` · ${document.page_count} str.`}
                    {` · ${document.block_count} odlomaka`}
                  </>
                )}
                {" · "}
                {format(new Date(document.created_at), "d. MMMM yyyy.", {
                  locale: hr,
                })}
              </p>

              {document.error_message && (
                <p className="mt-2 text-sm text-danger-fg">
                  {document.error_message}
                </p>
              )}
            </div>

            <div className="flex shrink-0 gap-2">
              {/* An upload that never finished, or extraction that failed, is
                  retryable from the file already in Storage. */}
              {(document.status === "failed" ||
                document.status === "uploading") && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleRetry(document.id)}
                  disabled={busyId !== null}
                >
                  {busyId === document.id ? "Obrađujem…" : "Pokušaj ponovno"}
                </Button>
              )}
              {/* Re-extraction with the current algorithm — for documents
                  ingested before a grouping improvement (two-column papers). */}
              {document.status === "ready" && document.kind === "pdf" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRetry(document.id, true)}
                  disabled={busyId !== null}
                >
                  {busyId === document.id ? "Obrađujem…" : "Ponovno obradi"}
                </Button>
              )}
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDelete(document.id, document.title)}
                disabled={busyId !== null}
              >
                Obriši
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
