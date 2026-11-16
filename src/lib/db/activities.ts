import type { Tx } from "@/lib/db";
import { withDownloadUrls } from "@/lib/activity-materials";
import type { Activity, ActivityMaterial } from "@/types";

/**
 * One activity as the page and the API return it: the row, its proposer's
 * name and its materials in page order — what Supabase's
 * `select("*, creator:profiles!created_by(id, full_name),
 * materials:activity_materials(*)")` embed produced. Both reads run under the
 * caller's role, so an activity they may not see is null and its materials
 * are never fetched.
 */
export async function loadActivity(tx: Tx, id: string): Promise<Activity | null> {
  const [activity] = await tx<Activity[]>`
    SELECT * FROM activities_with_creator WHERE id = ${id}
  `;
  if (!activity) return null;
  const materials = await tx<ActivityMaterial[]>`
    SELECT * FROM activity_materials WHERE activity_id = ${id}
  `;
  return { ...activity, materials: withDownloadUrls([...materials]) };
}
