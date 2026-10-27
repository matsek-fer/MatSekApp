"use client";

import { useMemo, useState } from "react";
import type { LibraryEntry } from "@/lib/materials-meta";
import {
  ACTIVITY_MATERIAL_MIME_BY_EXTENSION,
  ACTIVITY_MATERIAL_PHASE_LABELS,
  type ActivityMaterialKind,
  type ActivityMaterialPhase,
} from "@/types";
import {
  isMaterialUrl,
  MAX_ACTIVITY_MATERIAL_BYTES,
  MAX_ACTIVITY_MATERIALS,
} from "@/lib/validation";
import { formatBytes } from "@/lib/activity-materials";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/**
 * One material as the form holds it before submit. A file is kept as the
 * `File` itself; it is only uploaded once the activity exists and has an
 * id for the storage path.
 */
export interface DraftMaterial {
  key: string;
  phase: ActivityMaterialPhase;
  kind: ActivityMaterialKind;
  title: string;
  url: string;
  note: string;
  file: File | null;
}

const PHASES: ActivityMaterialPhase[] = ["before", "during"];

const KIND_ICON: Record<ActivityMaterialKind, string> = {
  library: "📚",
  link: "🔗",
  file: "📄",
};

const ACCEPT = ".pdf,.md,.markdown,.txt";

/** How many library hits the dropdown shows — a page, not a scroll. */
const MAX_HITS = 8;

function newKey() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

/**
 * The two reading lists on the proposal form.
 *
 * Each list has its own "add" row with three sources — the Materials
 * library, a pasted link, a file from disk — because a material's phase is
 * the first thing a proposer knows about it ("read this before you come"),
 * and asking for it afterwards as a tag on a single list buried that.
 */
export default function ActivityMaterialsEditor({
  library,
  value,
  onChange,
  disabled = false,
}: {
  library: LibraryEntry[];
  value: DraftMaterial[];
  onChange: (next: DraftMaterial[]) => void;
  disabled?: boolean;
}) {
  const full = value.length >= MAX_ACTIVITY_MATERIALS;

  const add = (draft: Omit<DraftMaterial, "key">) =>
    onChange([...value, { ...draft, key: newKey() }]);
  const remove = (key: string) => onChange(value.filter((d) => d.key !== key));

  return (
    <fieldset className="space-y-5" disabled={disabled}>
      <legend className="field-label">Materijali</legend>
      <p className="!mt-0 text-xs text-fg-subtle">
        Neobavezno. Teme i knjige iz knjižnice, vanjske poveznice ili vlastiti
        dokumenti (PDF, Markdown, tekst — do 25 MB).
      </p>

      {PHASES.map((phase) => (
        <PhaseBlock
          key={phase}
          phase={phase}
          items={value.filter((d) => d.phase === phase)}
          library={library}
          full={full}
          onAdd={(d) => add({ ...d, phase })}
          onRemove={remove}
        />
      ))}
    </fieldset>
  );
}

type NewDraft = Omit<DraftMaterial, "key" | "phase">;

function PhaseBlock({
  phase,
  items,
  library,
  full,
  onAdd,
  onRemove,
}: {
  phase: ActivityMaterialPhase;
  items: DraftMaterial[];
  library: LibraryEntry[];
  full: boolean;
  onAdd: (d: NewDraft) => void;
  onRemove: (key: string) => void;
}) {
  const meta = ACTIVITY_MATERIAL_PHASE_LABELS[phase];
  return (
    <div className="rounded-lg border border-border bg-surface-raised p-4">
      <div className="mb-3">
        <h3 className="text-sm font-medium text-fg">{meta.label}</h3>
        <p className="text-xs text-fg-subtle">{meta.hint}</p>
      </div>

      {items.length > 0 && (
        <ul className="mb-3 space-y-1.5">
          {items.map((d) => (
            <li
              key={d.key}
              className="flex items-start gap-2 rounded-md bg-surface px-3 py-2 text-sm"
            >
              <span aria-hidden className="mt-px">
                {KIND_ICON[d.kind]}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium text-fg">
                  {d.title}
                </span>
                <span className="block truncate text-xs text-fg-muted">
                  {d.kind === "file" && d.file
                    ? `${d.file.name} · ${formatBytes(d.file.size)}`
                    : d.kind === "library"
                      ? d.note
                      : d.url.replace(/^https?:\/\//, "")}
                </span>
              </span>
              <button
                type="button"
                onClick={() => onRemove(d.key)}
                aria-label={`Ukloni ${d.title}`}
                className="rounded px-1 text-fg-subtle hover:bg-surface-hover hover:text-danger"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      {full ? (
        <p className="text-xs text-fg-subtle">
          Dosegnut je najveći broj materijala ({MAX_ACTIVITY_MATERIALS}).
        </p>
      ) : (
        <AddMaterial library={library} onAdd={onAdd} />
      )}
    </div>
  );
}

type Mode = ActivityMaterialKind;

const MODE_LABELS: Record<Mode, string> = {
  library: "Iz knjižnice",
  link: "Poveznica",
  file: "Datoteka",
};

function AddMaterial({
  library,
  onAdd,
}: {
  library: LibraryEntry[];
  onAdd: (d: NewDraft) => void;
}) {
  const [mode, setMode] = useState<Mode>("library");
  const [error, setError] = useState("");

  // Library search
  const [query, setQuery] = useState("");
  const hits = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return library
      .filter(
        (e) =>
          e.title.toLowerCase().includes(q) || e.topic.toLowerCase().includes(q)
      )
      .slice(0, MAX_HITS);
  }, [library, query]);

  // Link
  const [url, setUrl] = useState("");
  const [linkTitle, setLinkTitle] = useState("");

  // File
  const [file, setFile] = useState<File | null>(null);
  const [fileTitle, setFileTitle] = useState("");
  const [fileInputKey, setFileInputKey] = useState(0);

  function pickLibrary(e: LibraryEntry) {
    onAdd({
      kind: "library",
      title: e.title,
      url: e.url,
      note:
        e.kind === "topic"
          ? "Tema iz knjižnice"
          : [e.type, e.topic].filter(Boolean).join(" · "),
      file: null,
    });
    setQuery("");
    setError("");
  }

  function addLink() {
    const trimmed = url.trim();
    if (!isMaterialUrl(trimmed)) {
      setError("Poveznica treba počinjati s http:// ili https://.");
      return;
    }
    onAdd({
      kind: "link",
      title: linkTitle.trim() || trimmed.replace(/^https?:\/\//, ""),
      url: trimmed,
      note: "",
      file: null,
    });
    setUrl("");
    setLinkTitle("");
    setError("");
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError("");
    const picked = e.target.files?.[0] ?? null;
    setFile(picked);
    // The filename without its extension is nearly always the title the
    // member would have typed, so it is offered rather than demanded.
    if (picked && !fileTitle.trim()) {
      setFileTitle(picked.name.replace(/\.[^.]+$/, ""));
    }
  }

  function addFile() {
    if (!file) {
      setError("Odaberi datoteku.");
      return;
    }
    const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (!ACTIVITY_MATERIAL_MIME_BY_EXTENSION[extension]) {
      setError("Podržani su PDF, Markdown i tekstualne datoteke.");
      return;
    }
    if (file.size > MAX_ACTIVITY_MATERIAL_BYTES) {
      setError("Datoteka je veća od 25 MB.");
      return;
    }
    onAdd({
      kind: "file",
      title: fileTitle.trim() || file.name,
      url: "",
      note: "",
      file,
    });
    setFile(null);
    setFileTitle("");
    setFileInputKey((k) => k + 1);
    setError("");
  }

  return (
    <div className="space-y-2">
      <div
        className="inline-flex rounded-lg border border-border-strong bg-surface p-0.5"
        role="group"
        aria-label="Izvor materijala"
      >
        {(Object.keys(MODE_LABELS) as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMode(m);
              setError("");
            }}
            aria-pressed={mode === m}
            className={cn(
              "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
              mode === m ? "bg-brand text-brand-fg" : "text-fg hover:bg-surface-hover"
            )}
          >
            {MODE_LABELS[m]}
          </button>
        ))}
      </div>

      {mode === "library" && (
        <div className="relative">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pretraži teme i knjige po naslovu…"
            aria-label="Pretraži knjižnicu materijala"
            className="field text-sm"
          />
          {query.trim() && (
            <ul
              className="absolute left-0 right-0 z-10 mt-1 max-h-72 overflow-y-auto rounded-lg border border-border bg-surface shadow-lg"
              role="listbox"
            >
              {hits.length === 0 ? (
                <li className="px-3 py-2 text-sm text-fg-subtle">
                  Ništa nije pronađeno.
                </li>
              ) : (
                hits.map((e) => (
                  <li key={`${e.kind}:${e.topic}:${e.title}`}>
                    <button
                      type="button"
                      onClick={() => pickLibrary(e)}
                      className="flex w-full flex-col items-start px-3 py-2 text-left hover:bg-surface-hover"
                    >
                      <span className="text-sm text-fg">{e.title}</span>
                      <span className="text-xs text-fg-muted">
                        {e.kind === "topic"
                          ? "Tema"
                          : [e.type, e.topic].filter(Boolean).join(" · ")}
                      </span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      )}

      {mode === "link" && (
        <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://…"
            aria-label="Poveznica"
            className="field text-sm"
          />
          <input
            type="text"
            value={linkTitle}
            onChange={(e) => setLinkTitle(e.target.value)}
            placeholder="Naslov (neobavezno)"
            aria-label="Naslov poveznice"
            className="field text-sm"
          />
          <Button type="button" variant="secondary" size="sm" onClick={addLink}>
            Dodaj
          </Button>
        </div>
      )}

      {mode === "file" && (
        <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
          <input
            key={fileInputKey}
            type="file"
            accept={ACCEPT}
            onChange={handleFileChange}
            aria-label="Datoteka"
            className="block w-full rounded-lg border border-border bg-bg px-3 py-1.5 text-sm text-fg file:mr-3 file:rounded-md file:border-0 file:bg-surface-hover file:px-3 file:py-1 file:text-sm file:text-fg hover:file:bg-border"
          />
          <input
            type="text"
            value={fileTitle}
            onChange={(e) => setFileTitle(e.target.value)}
            placeholder="Naslov"
            aria-label="Naslov datoteke"
            className="field text-sm"
          />
          <Button type="button" variant="secondary" size="sm" onClick={addFile}>
            Dodaj
          </Button>
        </div>
      )}

      {error && <p className="text-xs text-danger-fg">{error}</p>}
    </div>
  );
}
