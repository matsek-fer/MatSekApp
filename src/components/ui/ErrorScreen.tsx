/**
 * The body of every error and not-found page: one short heading, one line
 * of explanation, and a way out. Pages wrap it in whatever chrome they have
 * (the dashboard keeps its navbar; the root pages stand alone).
 */
export default function ErrorScreen({
  code,
  title,
  body,
  children,
}: {
  /** Shown large and dim above the heading — "404", or nothing for a crash. */
  code?: string;
  title: string;
  body: string;
  /** Extra actions, rendered before the children; `ButtonLink`s or `Button`s. */
  children?: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      {code && (
        <p className="font-mono text-6xl font-bold text-fg-subtle" aria-hidden="true">
          {code}
        </p>
      )}
      <h1 className="mt-4 text-2xl font-bold text-fg">{title}</h1>
      <p className="mt-2 text-fg-muted leading-relaxed">{body}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">{children}</div>
    </div>
  );
}
