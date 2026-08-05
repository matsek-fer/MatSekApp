"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { PROVIDER_MODELS, defaultModelFor } from "@/lib/ai/models";
import type { AiKeyInfo, AiProvider } from "@/lib/ai/types";
import type { SelectionAnchor } from "@/lib/documents/selection";
import {
  AI_PROVIDER_LABELS,
  type ChatMessage,
  type ChatThread,
} from "@/types";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import { Select } from "@/components/ui/Field";
import AssistantText from "@/components/documents/AssistantText";

/**
 * The conversation column.
 *
 * The stream is consumed with fetch + getReader + TextDecoder, NOT
 * EventSource — EventSource cannot POST and cannot carry a body, and the
 * question travels in the body. Frames arrive as `data: {json}\n\n`; a
 * `token` frame appends to the growing answer, `error` surfaces inline where
 * the assistant bubble would be, `done` swaps the draft for the saved row.
 *
 * "Zaustavi" is an AbortController — the repo's first. The old `let
 * cancelled` flag pattern only stops the UI updating; aborting the fetch
 * collapses the connection, which fires request.signal in the route, which
 * aborts the provider call. Anything less keeps burning the member's tokens
 * on an answer nobody is reading.
 */

interface ChatPanelProps {
  documentId: string;
  /** Set when the member picks "Pitaj" over a selection; consumed on send. */
  pendingAnchor: SelectionAnchor | null;
  onAnchorConsumed: () => void;
}

interface DraftAssistant {
  text: string;
  streaming: boolean;
  /** "Pretražujem dokument…" while a mid-answer search runs; token clears it. */
  status?: string;
}

export default function ChatPanel({
  documentId,
  pendingAnchor,
  onAnchorConsumed,
}: ChatPanelProps) {
  const [keys, setKeys] = useState<AiKeyInfo[] | null>(null);
  const [usage, setUsage] = useState<{ calls: number } | null>(null);
  const [provider, setProvider] = useState<AiProvider | null>(null);
  const [model, setModel] = useState("");
  const [thread, setThread] = useState<ChatThread | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState<DraftAssistant | null>(null);
  const [question, setQuestion] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const abortRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Which providers hold a key decides what the picker offers. No key at
  // all is a first-run state, not an error.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/ai/keys");
        const json = await res.json();
        if (cancelled || !json.success) return;
        const list = json.data as AiKeyInfo[];
        setKeys(list);
        if (list.length > 0) {
          setProvider(list[0].provider);
          setModel(defaultModelFor(list[0].provider));
        }
      } catch {
        if (!cancelled) setKeys([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // The meter. Refreshed after every send so a runaway loop shows up here,
  // in the UI, rather than on the member's provider bill.
  const refreshUsage = useCallback(async () => {
    try {
      const res = await fetch("/api/ai/usage");
      const json = await res.json();
      if (json.success) setUsage(json.data);
    } catch {
      // The meter is informational; a failed fetch is not worth an alert.
    }
  }, []);

  useEffect(() => {
    refreshUsage();
  }, [refreshUsage]);

  // A selection arriving from the popover belongs in the input's focus.
  useEffect(() => {
    if (pendingAnchor) inputRef.current?.focus();
  }, [pendingAnchor]);

  // Keep the newest turn in view while tokens arrive.
  useEffect(() => {
    const node = scrollRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages, draft]);

  // The stream must not outlive the panel.
  useEffect(() => () => abortRef.current?.abort(), []);

  const send = useCallback(async () => {
    const trimmed = question.trim();
    if (!trimmed || busy || !provider) return;

    setError("");
    setBusy(true);

    try {
      // The thread is created lazily on the first message, locked to the
      // provider and model chosen at that moment.
      let activeThread = thread;
      if (!activeThread) {
        const res = await fetch(`/api/documents/${documentId}/threads`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ provider, model }),
        });
        const json = await res.json();
        if (!json.success) {
          setError(json.error || "Razgovor nije moguće stvoriti.");
          return;
        }
        activeThread = json.data as ChatThread;
        setThread(activeThread);
      }

      const anchor = pendingAnchor;
      const optimistic: ChatMessage = {
        id: `optimistic-${Date.now()}`,
        thread_id: activeThread.id,
        role: "user",
        body: trimmed,
        // The browser's quote is display-only; the server stores its own.
        anchor: anchor ? { quote: anchor.quote } : null,
        stopped_early: false,
        error_note: "",
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, optimistic]);
      setQuestion("");
      onAnchorConsumed();

      const controller = new AbortController();
      abortRef.current = controller;
      setDraft({ text: "", streaming: true });

      const res = await fetch(`/api/documents/${documentId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          threadId: activeThread.id,
          question: trimmed,
          anchor: anchor
            ? {
                fromBlockId: anchor.fromBlockId,
                fromOffset: anchor.fromOffset,
                toBlockId: anchor.toBlockId,
                toOffset: anchor.toOffset,
                quote: "",
                quoteHash: "",
              }
            : null,
        }),
        signal: controller.signal,
      });

      // Pre-stream failures are ordinary JSON with a status; only once the
      // content type says event-stream do frames start.
      const contentType = res.headers.get("content-type") ?? "";
      if (!contentType.includes("text/event-stream")) {
        const json = await res.json();
        setError(json.error || "Došlo je do greške.");
        setDraft(null);
        return;
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let answer = "";

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Frames are delimited by a blank line; the tail stays in the
        // buffer until its delimiter arrives.
        const frames = buffer.split("\n\n");
        buffer = frames.pop() ?? "";

        for (const raw of frames) {
          if (!raw.startsWith("data: ")) continue;
          const payload = JSON.parse(raw.slice(6));

          if (payload.type === "token") {
            answer += payload.text;
            setDraft({ text: answer, streaming: true });
          } else if (payload.type === "tool") {
            setDraft({
              text: answer,
              streaming: true,
              status: payload.query
                ? `Pretražujem dokument: „${payload.query}”`
                : "Pretražujem dokument",
            });
          } else if (payload.type === "error") {
            setError(payload.error);
            setDraft(null);
          } else if (payload.type === "done" && payload.message) {
            setMessages((prev) => [...prev, payload.message as ChatMessage]);
            setDraft(null);
          }
        }
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") {
        // The member stopped it; keep what streamed, marked as cut off.
        setDraft((current) =>
          current ? { ...current, streaming: false } : null
        );
      } else {
        setError("Veza je prekinuta. Pokušaj ponovno.");
        setDraft(null);
      }
    } finally {
      abortRef.current = null;
      setBusy(false);
      refreshUsage();
    }
  }, [
    question,
    busy,
    provider,
    model,
    thread,
    documentId,
    pendingAnchor,
    onAnchorConsumed,
    refreshUsage,
  ]);

  function stop() {
    abortRef.current?.abort();
  }

  /**
   * Back to the picker. The old thread and its transcript stay in the
   * database untouched — this only ends what the panel is pointed at.
   */
  function startNewThread() {
    abortRef.current?.abort();
    setThread(null);
    setMessages([]);
    setDraft(null);
    setError("");
  }

  if (keys === null) {
    return <p className="p-4 text-sm text-fg-muted">Učitavam…</p>;
  }

  if (keys.length === 0) {
    return (
      <div className="p-4">
        <Alert tone="info">
          Za razgovor o dokumentu upiši svoj AI ključ u{" "}
          <Link href="/profile/ai" className="underline">
            postavkama profila
          </Link>
          .
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Provider and model lock once the thread exists — one conversation,
          one assistant, so a transcript never crosses providers. Switching
          is starting a new conversation, and the bar below is that door. */}
      {thread && (
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border px-3 py-2">
          <p className="truncate text-xs text-fg-muted">
            {PROVIDER_MODELS[thread.provider].find((m) => m.id === thread.model)
              ?.label ?? thread.model}
            {usage && ` · ${usage.calls}/24 h`}
          </p>
          <Button variant="ghost" size="sm" onClick={startNewThread}>
            Novi razgovor
          </Button>
        </div>
      )}

      {!thread && provider && (
        <div className="flex shrink-0 gap-2 border-b border-border p-3">
          <Select
            label="Pružatelj"
            className="flex-1"
            value={provider}
            onChange={(e) => {
              const next = e.target.value as AiProvider;
              setProvider(next);
              setModel(defaultModelFor(next));
            }}
          >
            {keys.map((key) => (
              <option key={key.provider} value={key.provider}>
                {AI_PROVIDER_LABELS[key.provider]}
              </option>
            ))}
          </Select>
          <Select
            label="Model"
            className="flex-1"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          >
            {PROVIDER_MODELS[provider].map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </Select>
        </div>
      )}

      <div ref={scrollRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 && !draft && (
          <p className="text-sm text-fg-muted">
            Odaberi tekst u dokumentu i klikni „Pitaj o odabranom”, ili
            postavi pitanje ovdje.
          </p>
        )}

        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {draft && (
          <div className="rounded-lg border border-border bg-surface p-3">
            {draft.text ? (
              <AssistantText text={draft.text} />
            ) : !draft.status ? (
              <p className="text-sm text-fg-muted">Razmišljam…</p>
            ) : null}
            {draft.status && (
              <p className="mt-2 animate-pulse text-xs text-fg-muted">
                {draft.status}…
              </p>
            )}
            {!draft.streaming && (
              <p className="mt-2 text-xs text-fg-subtle">Zaustavljeno.</p>
            )}
          </div>
        )}

        <Alert tone="error">{error}</Alert>
      </div>

      <div className="shrink-0 border-t border-border p-3">
        {pendingAnchor && (
          <div className="mb-2 flex items-start justify-between gap-2 rounded-lg border-l-2 border-brand bg-brand/5 px-3 py-2">
            <p className="text-xs italic text-fg-muted">
              „{pendingAnchor.quote.slice(0, 160)}
              {pendingAnchor.quote.length > 160 ? "…" : ""}”
            </p>
            <button
              type="button"
              onClick={onAnchorConsumed}
              aria-label="Ukloni odabir"
              className="text-fg-subtle hover:text-fg"
            >
              ×
            </button>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="flex items-end gap-2"
        >
          <textarea
            ref={inputRef}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            rows={2}
            placeholder={
              pendingAnchor ? "Pitaj o odabranom ulomku…" : "Postavi pitanje…"
            }
            className="field min-h-[2.5rem] flex-1 resize-none"
            disabled={busy && !draft?.streaming}
          />
          {draft?.streaming ? (
            <Button type="button" variant="secondary" onClick={stop}>
              Zaustavi
            </Button>
          ) : (
            <Button type="submit" disabled={busy || !question.trim()}>
              Pošalji
            </Button>
          )}
        </form>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const quote =
    message.anchor && typeof message.anchor === "object"
      ? String((message.anchor as { quote?: unknown }).quote ?? "")
      : "";

  if (message.role === "user") {
    return (
      <div className="ml-6 rounded-lg bg-brand/10 p-3">
        {quote && (
          <p className="mb-2 border-l-2 border-brand pl-2 text-xs italic text-fg-muted">
            „{quote.slice(0, 160)}
            {quote.length > 160 ? "…" : ""}”
          </p>
        )}
        <p className="whitespace-pre-wrap text-sm text-fg">{message.body}</p>
      </div>
    );
  }

  // An assistant row with no body is a recorded failure or refusal; the
  // note is the content.
  if (!message.body) {
    return <Alert tone="error">{message.error_note || "Nema odgovora."}</Alert>;
  }

  return (
    <div className="mr-6 rounded-lg border border-border bg-surface p-3">
      <AssistantText text={message.body} />
      {message.stopped_early && (
        <p className="mt-2 text-xs text-fg-subtle">Zaustavljeno.</p>
      )}
    </div>
  );
}
