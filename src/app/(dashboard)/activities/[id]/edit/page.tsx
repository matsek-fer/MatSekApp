import { notFound, redirect } from "next/navigation";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { getLibraryIndex } from "@/lib/materials";
import { getLibrarySiteIndex } from "@/lib/library";
import type { Activity } from "@/types";
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
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data }, { data: profile }, site] = await Promise.all([
    supabase
      .from("activities")
      .select("*, materials:activity_materials(*)")
      .eq("id", id)
      .single(),
    supabase.from("profiles").select("role").eq("id", user.id).single(),
    getLibrarySiteIndex(),
  ]);

  if (!data) notFound();
  const activity = data as Activity;

  const isAdmin = profile?.role === "admin";
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
