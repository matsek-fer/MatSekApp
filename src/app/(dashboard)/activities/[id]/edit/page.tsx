import { notFound, redirect } from "next/navigation";
import { withUser } from "@/lib/db";
import { loadActivity } from "@/lib/db/activities";
import { requireUser } from "@/lib/auth/session";
import { isUuid } from "@/lib/validation";
import { getLibraryIndex } from "@/lib/materials";
import { getLibrarySiteIndex } from "@/lib/library";
import ActivityForm from "@/components/activities/ActivityForm";

export const dynamic = "force-dynamic";

/**
 * The proposal form again, filled in. Its author may open it until the
 * activity is rejected, an admin always — the same rule the PATCH route and
 * the UPDATE policies apply; this page only keeps the form from someone it
 * would refuse on save.
 */
export default async function EditActivityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser(`/activities/${id}/edit`);
  if (!isUuid(id)) notFound();

  const [activity, site] = await Promise.all([
    withUser(user.id, (tx) => loadActivity(tx, id)),
    getLibrarySiteIndex(),
  ]);

  if (!activity) notFound();

  const isAdmin = user.role === "admin";
  const isOwner = activity.created_by === user.id;
  if (!isAdmin && !(isOwner && activity.status !== "rejected")) {
    redirect(`/activities/${id}`);
  }

  const library = [...site.entries, ...getLibraryIndex()];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-fg">Uredi aktivnost</h1>
        <p className="mt-1 text-sm text-fg-muted">{activity.title}</p>
      </div>

      <ActivityForm
        library={library}
        libraryAvailable={site.available}
        activity={activity}
        needsReview={!isAdmin && activity.status === "approved"}
      />
    </div>
  );
}
