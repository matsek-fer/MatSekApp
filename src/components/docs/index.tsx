import Link from "next/link";
import type { Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Building blocks of the long-form documentation page. Prose styling lives
 * here rather than in a typography plugin so the page uses the same tokens
 * as the rest of the site — `text-fg`, `border-border` — and follows the
 * theme for free.
 */

export type TocEntry = { id: string; label: string; depth?: 1 | 2 };

export function Toc({ entries, title }: { entries: TocEntry[]; title: string }) {
  return (
    <nav aria-label={title} className="text-sm">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-fg-subtle">
        {title}
      </p>
      <ul className="space-y-1 border-l border-border">
        {entries.map((e) => (
          <li key={e.id}>
            <a
              href={`#${e.id}`}
              className={cn(
                "-ml-px block border-l border-transparent py-0.5 pl-3 text-fg-muted",
                "hover:border-brand hover:text-fg",
                e.depth === 2 && "pl-6 text-[13px]"
              )}
            >
              {e.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-border pt-10 first:border-t-0 first:pt-0">
      <h2 className="mb-5 text-2xl font-bold tracking-tight text-fg">
        <a href={`#${id}`} className="hover:text-brand">
          {title}
        </a>
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function Sub({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 pt-4">
      <h3 className="mb-3 text-lg font-semibold text-fg">
        <a href={`#${id}`} className="hover:text-brand">
          {title}
        </a>
      </h3>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function P({ children }: { children: React.ReactNode }) {
  return <p className="leading-7 text-fg">{children}</p>;
}

export function Ul({ children }: { children: React.ReactNode }) {
  return <ul className="list-disc space-y-2 pl-6 leading-7 text-fg">{children}</ul>;
}

export function Ol({ children }: { children: React.ReactNode }) {
  return <ol className="list-decimal space-y-2 pl-6 leading-7 text-fg">{children}</ol>;
}

export function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-surface-hover px-1.5 py-0.5 font-mono text-[0.9em] text-fg">
      {children}
    </code>
  );
}

export function Pre({ children }: { children: React.ReactNode }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-border bg-surface p-4 font-mono text-sm leading-6 text-fg">
      {children}
    </pre>
  );
}

export function A({ href, children }: { href: string; children: React.ReactNode }) {
  const external = /^https?:/.test(href);
  const cls = "text-brand underline decoration-brand/40 underline-offset-2 hover:decoration-brand";
  return external ? (
    <a href={href} className={cls} target="_blank" rel="noreferrer">
      {children}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

/** The "not built yet" marker — the same word the diagrams use. */
export function Planned({ lang }: { lang: Lang }) {
  return (
    <span className="mx-1 inline-flex items-center rounded-full bg-warning-bg px-2 py-0.5 align-middle text-xs font-semibold text-warning-fg">
      {lang === "hr" ? "u planu" : "planned"}
    </span>
  );
}

export function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border-l-4 border-brand bg-surface px-4 py-3 text-sm leading-6 text-fg-muted">
      {children}
    </div>
  );
}

/**
 * A diagram from public/tools, generated in both themes: both images are in
 * the markup and CSS picks one, the same trick the theme toggle's icons use,
 * so a theme switch swaps the picture without a request.
 */
export function Figure({
  name,
  lang,
  alt,
  caption,
}: {
  name: string;
  lang: Lang;
  alt: string;
  caption?: React.ReactNode;
}) {
  const base = `/tools/${name}.${lang}`;
  return (
    <figure className="my-6">
      <div className="overflow-x-auto rounded-xl border border-border bg-surface p-3">
        {/* eslint-disable-next-line @next/next/no-img-element -- static SVG, no optimisation wanted */}
        <img src={`${base}.light.svg`} alt={alt} className="mx-auto w-full max-w-4xl dark:hidden" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${base}.dark.svg`} alt={alt} className="mx-auto hidden w-full max-w-4xl dark:block" />
      </div>
      {caption && (
        <figcaption className="mt-2 text-sm leading-6 text-fg-muted">{caption}</figcaption>
      )}
    </figure>
  );
}

export function Video({
  name,
  caption,
  label,
}: {
  name: string;
  caption?: React.ReactNode;
  label: string;
}) {
  return (
    <figure className="my-6">
      <video
        className="w-full rounded-xl border border-border bg-surface"
        controls
        muted
        loop
        playsInline
        preload="metadata"
        poster={`/tools/${name}-poster.jpg`}
        aria-label={label}
      >
        <source src={`/tools/${name}.webm`} type="video/webm" />
        <source src={`/tools/${name}.mp4`} type="video/mp4" />
      </video>
      {caption && (
        <figcaption className="mt-2 text-sm leading-6 text-fg-muted">{caption}</figcaption>
      )}
    </figure>
  );
}

/** A slot for a recording that has not been made yet — says so honestly. */
export function VideoSlot({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 rounded-xl border border-dashed border-border-strong bg-surface px-4 py-6 text-center text-sm text-fg-muted">
      {children}
    </div>
  );
}

export function StatusTable({
  rows,
  head,
  labels,
}: {
  rows: { what: string; state: "live" | "planned" }[];
  head: [string, string];
  labels: Record<"live" | "planned", string>;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-fg-muted">
            <th className="py-2 pr-4 font-medium">{head[0]}</th>
            <th className="py-2 font-medium">{head[1]}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.what} className="border-b border-border last:border-b-0">
              <td className="py-2 pr-4 text-fg">{r.what}</td>
              <td className="py-2">
                <span
                  className={cn(
                    "inline-flex rounded-full px-2 py-0.5 text-xs font-semibold",
                    r.state === "live"
                      ? "bg-success-bg text-success-fg"
                      : "bg-warning-bg text-warning-fg"
                  )}
                >
                  {labels[r.state]}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
