"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AI_PROVIDER_CONSOLE_URLS, AI_PROVIDER_LABELS } from "@/types";
import type { AiProvider } from "@/lib/ai/types";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Input } from "@/components/ui/Field";

interface AiKeyFormProps {
  provider: AiProvider;
  /** Last four characters of the saved key, or null if none is saved. */
  suffix: string | null;
}

export default function AiKeyForm({ provider, suffix }: AiKeyFormProps) {
  const router = useRouter();

  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pending, setPending] = useState<"save" | "remove" | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!value.trim()) {
      setError("Upiši ključ.");
      return;
    }

    setPending("save");

    try {
      const res = await fetch("/api/ai/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, apiKey: value.trim() }),
      });
      const json = await res.json();

      if (json.success) {
        // Cleared immediately: there is no reason for the key to stay in the
        // page after it has been sent.
        setValue("");
        setSuccess("Ključ je spremljen i provjeren.");
        router.refresh();
      } else {
        setError(json.error || "Ključ nije spremljen.");
      }
    } catch {
      setError("Greška pri spremanju ključa.");
    } finally {
      setPending(null);
    }
  }

  async function handleRemove() {
    setError("");
    setSuccess("");
    setPending("remove");

    try {
      const res = await fetch(`/api/ai/keys/${provider}`, { method: "DELETE" });
      const json = await res.json();

      if (json.success) {
        setSuccess(json.data?.message ?? "Ključ je uklonjen.");
        router.refresh();
      } else {
        setError(json.error || "Ključ nije uklonjen.");
      }
    } catch {
      setError("Greška pri uklanjanju ključa.");
    } finally {
      setPending(null);
    }
  }

  return (
    <Card className="space-y-4 p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-medium text-fg">{AI_PROVIDER_LABELS[provider]}</h2>
        <a
          href={AI_PROVIDER_CONSOLE_URLS[provider]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-fg-muted underline hover:text-brand"
        >
          Gdje dobiti ključ
        </a>
      </div>

      <Alert tone="error">{error}</Alert>
      <Alert tone="success">{success}</Alert>

      {suffix ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-fg-muted">
            Spremljen ključ{" "}
            <span className="font-mono text-fg">••••{suffix}</span>
          </p>
          <Button
            variant="danger"
            size="sm"
            onClick={handleRemove}
            disabled={pending !== null}
          >
            {pending === "remove" ? "Uklanjam…" : "Ukloni"}
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSave} className="flex flex-wrap items-end gap-3">
          <div className="min-w-0 flex-1">
            <Input
              label="API ključ"
              type="password"
              autoComplete="off"
              spellCheck={false}
              placeholder="Zalijepi ključ"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={pending !== null}
            />
          </div>
          <Button type="submit" disabled={pending !== null}>
            {pending === "save" ? "Provjeravam…" : "Spremi"}
          </Button>
        </form>
      )}
    </Card>
  );
}
