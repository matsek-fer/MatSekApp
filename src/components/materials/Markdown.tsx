import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { cn } from "@/lib/utils";

/**
 * Renders the topic Markdown. Allows the raw `<details>` blocks the content
 * uses for hints, and turns `topic-id` code spans into links to that topic.
 */
export default function Markdown({
  children,
  topicIds = [],
  className,
  inline = false,
}: {
  children: string;
  /** Known topic ids; backticked occurrences become links. */
  topicIds?: string[];
  className?: string;
  /** Render without block wrappers (for one-line fields). */
  inline?: boolean;
}) {
  const ids = new Set(topicIds);
  const components: Components = {
    a: ({ href, children }) => {
      const external = href && /^https?:\/\//.test(href);
      // A hosted PDF is read, not navigated to; keep the topic page open.
      const newTab = external || (href && /\.pdf$/i.test(href));
      return (
        <a
          href={href}
          target={newTab ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className="text-brand hover:underline break-words"
        >
          {children}
        </a>
      );
    },
    code: ({ children }) => {
      const text = String(children).trim();
      if (ids.has(text)) {
        return (
          <Link
            href={`/materials/${text}`}
            className="rounded bg-brand/10 px-1 py-0.5 font-mono text-[0.85em] text-brand hover:bg-brand/20 no-underline"
          >
            {text}
          </Link>
        );
      }
      return (
        <code className="rounded bg-surface-hover px-1 py-0.5 font-mono text-[0.85em]">
          {children}
        </code>
      );
    },
    ...(inline ? { p: ({ children }) => <>{children}</> } : {}),
  };

  return (
    <div
      className={cn(
        !inline &&
          "prose max-w-none prose-code:before:content-none prose-code:after:content-none prose-headings:font-semibold prose-h3:text-base prose-h3:mt-6 prose-li:my-1 prose-p:leading-relaxed",
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
