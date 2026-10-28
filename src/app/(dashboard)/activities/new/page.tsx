import { getLibraryIndex } from "@/lib/materials";
import { getLibrarySiteIndex } from "@/lib/library";
import NewActivityForm from "@/components/activities/NewActivityForm";

// The library site's index is fetched per request (and cached for an hour
// by fetch), so the form never serves a list prerendered at build time
// from a site that was unreachable then.
export const dynamic = "force-dynamic";

/**
 * What the form searches: the MatSek library (problems, proofs, blogs, the
 * forest), then the Materials pages. Both are read on the server and handed
 * over as one list, so a search is a filter on a prop and not a request.
 */
export default async function NewActivityPage() {
  const site = await getLibrarySiteIndex();
  const library = [...site.entries, ...getLibraryIndex()];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-fg">Predloži novu aktivnost</h1>
        <p className="mt-1 text-sm text-fg-muted">
          Prijedlog ide administratoru na pregled prije objave u kalendaru.
        </p>
      </div>

      <NewActivityForm library={library} libraryAvailable={site.available} />
    </div>
  );
}
