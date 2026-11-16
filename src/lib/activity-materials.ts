import type { ActivityMaterial } from "@/types";

/**
 * The route a material's file is downloaded from. It looks the material up
 * through RLS on every request, so a link copied out of the page is still
 * only good for someone who may see the activity — what a short-lived signed
 * URL used to approximate with an expiry.
 */
export function materialFileUrl(m: Pick<ActivityMaterial, "activity_id" | "id">): string {
  return `/api/activities/${m.activity_id}/materials/${m.id}/file`;
}

/** Sorts an activity's materials into page order and links each uploaded file. */
export function withDownloadUrls(materials: ActivityMaterial[]): ActivityMaterial[] {
  return [...materials]
    .sort(
      (a, b) =>
        a.position - b.position || a.created_at.localeCompare(b.created_at)
    )
    .map((m) =>
      m.kind === "file" && m.storage_path
        ? { ...m, download_url: materialFileUrl(m) }
        : m
    );
}

/** "1,2 MB" style size for the activity page. */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} MB`;
}
