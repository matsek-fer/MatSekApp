"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { MAX_DOCUMENT_BYTES } from "@/lib/validation";
import { DOCUMENT_KIND_LABELS, type CreateDocumentResult, type DocumentKind } from "@/types";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Input } from "@/components/ui/Field";

/**
 * The three-step upload, from the browser's side.
 *
 *   1. POST /api/documents          — reserve the row, get a signed URL
 *   2. PUT straight to Storage      — the bytes never touch our server
 *   3. POST .../ingest              — extract the text
 *
 * Step 2 is why this is a client component at all. It also means the size and
 * type limits are the bucket's to enforce; the checks here exist to fail fast
 * with a Croatian message rather than after a long doomed upload.
 */

const KIND_BY_EXTENSION: Record<string, DocumentKind> = {
  pdf: "pdf",
  md: "markdown",
  markdown: "markdown",
  txt: "text",
};

const ACCEPT = ".pdf,.md,.markdown,.txt";

type Stage = null | "creating" | "uploading" | "extracting";

const STAGE_LABELS: Record<Exclude<Stage, null>, string> = {
  creating: "Pripremam…",
  uploading: "Učitavam…",
  extracting: "Obrađujem tekst…",
};

export default function DocumentUploader() {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [stage, setStage] = useState<Stage>(null);

  function kindOf(name: string): DocumentKind | null {
    const extension = name.split(".").pop()?.toLowerCase() ?? "";
    return KIND_BY_EXTENSION[extension] ?? null;
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError("");
    setSuccess("");

    const picked = e.target.files?.[0] ?? null;
    setFile(picked);

    // The filename without its extension is nearly always the title the
    // member would have typed, so it is offered rather than demanded.
    if (picked && !title.trim()) {
      setTitle(picked.name.replace(/\.[^.]+$/, ""));
    }
  }

  function reset() {
    setFile(null);
    setTitle("");
    if (fileInput.current) fileInput.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!file) {
      setError("Odaberi datoteku.");
      return;
    }

    const kind = kindOf(file.name);
    if (!kind) {
      setError("Podržani su PDF, Markdown i tekstualne datoteke.");
      return;
    }

    if (file.size > MAX_DOCUMENT_BYTES) {
      setError("Datoteka je veća od 25 MB.");
      return;
    }

    if (!title.trim()) {
      setError("Upiši naslov.");
      return;
    }

    try {
      setStage("creating");
      const createRes = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), kind }),
      });
      const createJson = await createRes.json();

      if (!createJson.success) {
        setError(createJson.error || "Dokument nije moguće stvoriti.");
        return;
      }

      const created = createJson.data as CreateDocumentResult;

      setStage("uploading");
      const supabase = createClient();
      const { error: uploadError } = await supabase.storage
        .from("documents")
        .uploadToSignedUrl(
          created.document.storage_path,
          created.upload_token,
          file,
          { contentType: created.content_type }
        );

      if (uploadError) {
        setError("Učitavanje nije uspjelo. Provjeri veličinu i vrstu datoteke.");
        return;
      }

      setStage("extracting");
      const ingestRes = await fetch(
        `/api/documents/${created.document.id}/ingest`,
        { method: "POST" }
      );
      const ingestJson = await ingestRes.json();

      if (!ingestJson.success) {
        // The row survives in `failed` with the reason on it, so the library
        // below can offer a retry without another upload.
        setError(ingestJson.error || "Obrada nije uspjela.");
        router.refresh();
        return;
      }

      setSuccess("Dokument je spreman.");
      reset();
      router.refresh();
    } catch {
      setError("Greška pri učitavanju dokumenta.");
    } finally {
      setStage(null);
    }
  }

  const busy = stage !== null;

  return (
    <Card className="space-y-4 p-6">
      <div>
        <h2 className="font-medium text-fg">Dodaj dokument</h2>
        <p className="mt-1 text-sm text-fg-muted">
          {Object.values(DOCUMENT_KIND_LABELS).join(", ")} — do 25 MB.
        </p>
      </div>

      <Alert tone="error">{error}</Alert>
      <Alert tone="success">{success}</Alert>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="document-file"
            className="mb-1.5 block text-sm font-medium text-fg"
          >
            Datoteka
          </label>
          <input
            id="document-file"
            ref={fileInput}
            type="file"
            accept={ACCEPT}
            onChange={handleFileChange}
            disabled={busy}
            className="block w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-fg file:mr-3 file:rounded-md file:border-0 file:bg-surface-hover file:px-3 file:py-1.5 file:text-sm file:text-fg hover:file:bg-border disabled:opacity-50"
          />
        </div>

        <Input
          label="Naslov"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Npr. Predavanja iz analize"
          disabled={busy}
        />

        <Button type="submit" disabled={busy}>
          {busy ? STAGE_LABELS[stage] : "Učitaj"}
        </Button>
      </form>
    </Card>
  );
}
