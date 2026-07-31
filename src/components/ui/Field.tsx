"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * Label + control, wired together with a generated id so clicking the label
 * focuses the control and screen readers announce the pair.
 */
type FieldShellProps = {
  label: string;
  hint?: string;
  className?: string;
};

export function Input({
  label,
  hint,
  className,
  ...props
}: FieldShellProps & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <input id={id} className="field" {...props} />
      {hint && <p className="mt-1 text-xs text-fg-subtle">{hint}</p>}
    </div>
  );
}

export function Textarea({
  label,
  hint,
  className,
  ...props
}: FieldShellProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <textarea id={id} className={cn("field", "resize-y")} {...props} />
      {hint && <p className="mt-1 text-xs text-fg-subtle">{hint}</p>}
    </div>
  );
}

export function Select({
  label,
  hint,
  className,
  children,
  ...props
}: FieldShellProps & React.SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <select id={id} className="field" {...props}>
        {children}
      </select>
      {hint && <p className="mt-1 text-xs text-fg-subtle">{hint}</p>}
    </div>
  );
}
