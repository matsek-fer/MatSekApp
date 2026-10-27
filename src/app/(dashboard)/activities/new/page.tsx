import { getLibraryIndex } from "@/lib/materials";
import NewActivityForm from "@/components/activities/NewActivityForm";

/**
 * The library index is read from content/materials on the server and
 * handed to the form, so searching it needs no round trip.
 */
export default function NewActivityPage() {
  const library = getLibraryIndex();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-fg">Predloži novu aktivnost</h1>
        <p className="mt-1 text-sm text-fg-muted">
          Prijedlog ide administratoru na pregled prije objave u kalendaru.
        </p>
      </div>

      <NewActivityForm library={library} />
    </div>
  );
}
