import Link from "next/link";
import {
  ACTIVITY_MATERIAL_PHASE_LABELS,
  type ActivityMaterial,
  type ActivityMaterialPhase,
} from "@/types";
import { formatBytes } from "@/lib/activity-materials";

const PHASES: ActivityMaterialPhase[] = ["before", "during"];

const FILE_TYPE_LABELS: Record<string, string> = {
  "application/pdf": "PDF",
  "text/markdown": "Markdown",
  "text/plain": "Tekst",
};

const ICON = { library: "📚", link: "🔗", file: "📄" } as const;

/**
 * An activity's materials as two lists, in the order the proposer built
 * them. Links and library entries are hyperlinks; a file is a download on
 * the signed URL the page minted, or plain text when none could be (the
 * object is missing, or the viewer may not fetch it).
 */
export default function ActivityMaterialsList({
  materials,
}: {
  materials: ActivityMaterial[];
}) {
  if (materials.length === 0) return null;

  return (
    <div className="space-y-5">
      {PHASES.map((phase) => {
        const items = materials.filter((m) => m.phase === phase);
        if (items.length === 0) return null;
        const meta = ACTIVITY_MATERIAL_PHASE_LABELS[phase];
        return (
          <div key={phase}>
            <h3 className="text-sm font-medium text-fg">{meta.label}</h3>
            <p className="text-xs text-fg-subtle">{meta.hint}</p>
            <ul className="mt-2 space-y-1.5">
              {items.map((m) => (
                <li key={m.id} className="flex items-start gap-2 text-sm">
                  <span aria-hidden className="mt-px">
                    {ICON[m.kind]}
                  </span>
                  <span className="min-w-0">
                    <MaterialLink material={m} />
                    <span className="block text-xs text-fg-muted">
                      {secondary(m)}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

function MaterialLink({ material: m }: { material: ActivityMaterial }) {
  const cls = "font-medium text-brand hover:underline break-words";

  if (m.kind === "file") {
    if (!m.download_url) {
      return (
        <span className="font-medium text-fg-muted">
          {m.title}{" "}
          <span className="font-normal text-fg-subtle">(datoteka nije dostupna)</span>
        </span>
      );
    }
    return (
      <a href={m.download_url} download={m.file_name || true} className={cls}>
        {m.title}
      </a>
    );
  }

  if (m.url.startsWith("/")) {
    return (
      <Link href={m.url} className={cls}>
        {m.title}
      </Link>
    );
  }

  return (
    <a href={m.url} target="_blank" rel="noopener noreferrer" className={cls}>
      {m.title}
    </a>
  );
}

function secondary(m: ActivityMaterial): string {
  if (m.kind === "file") {
    return [FILE_TYPE_LABELS[m.content_type] ?? "Datoteka", formatBytes(m.byte_size)]
      .filter(Boolean)
      .join(" · ");
  }
  if (m.kind === "library") return m.note || "Iz knjižnice materijala";
  try {
    return new URL(m.url).hostname.replace(/^www\./, "");
  } catch {
    return m.url;
  }
}
