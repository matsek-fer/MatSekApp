/**
 * Loading state for a navigation that crosses route groups — the landing
 * page's buttons, and the push to /calendar after signing in.
 *
 * The dashboard's own skeleton lives inside the dashboard layout, and that
 * layout is itself async: it asks Supabase who is signed in before it can
 * render the navbar. Coming from outside the group, nothing of the dashboard
 * exists yet to hold a skeleton, so the boundary that lets the click commit
 * has to sit here, above every group.
 *
 * The same boundary wraps the auth pages, which render in a few milliseconds,
 * so this is deliberately a bare page with a progress bar: a skeleton of the
 * wrong page would flash on every trip to /login.
 */
export default function RootLoading() {
  return (
    <main role="status" aria-busy="true" className="min-h-screen bg-bg">
      <span className="sr-only">Učitavanje…</span>
      <div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 h-0.5 overflow-hidden bg-border"
      >
        <div className="h-full w-1/3 bg-brand motion-safe:animate-progress motion-reduce:w-full" />
      </div>
    </main>
  );
}
