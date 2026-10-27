import type { createClient } from "@/lib/supabase/server";
import type { ActivityMaterial } from "@/types";

type RlsClient = Awaited<ReturnType<typeof createClient>>;

export const ACTIVITY_MATERIALS_BUCKET = "activity-materials";

/** How long a download link from the activity page stays valid. */
const DOWNLOAD_URL_TTL_SECONDS = 60 * 60;

/**
 * Sorts an activity's materials into page order and signs a download URL
 * for each uploaded file. Signing goes through the RLS client, so a reader
 * only ever gets a URL for a file whose activity they may see — the same
 * test the storage policy makes, made by the same role.
 */
export async function withDownloadUrls(
  supabase: RlsClient,
  materials: ActivityMaterial[]
): Promise<ActivityMaterial[]> {
  const sorted = [...materials].sort(
    (a, b) =>
      a.position - b.position || a.created_at.localeCompare(b.created_at)
  );

  return Promise.all(
    sorted.map(async (m) => {
      if (m.kind !== "file" || !m.storage_path) return m;
      const { data } = await supabase.storage
        .from(ACTIVITY_MATERIALS_BUCKET)
        .createSignedUrl(m.storage_path, DOWNLOAD_URL_TTL_SECONDS, {
          download: m.file_name || true,
        });
      return { ...m, download_url: data?.signedUrl ?? null };
    })
  );
}

/** "1,2 MB" style size for the activity page. */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} MB`;
}
