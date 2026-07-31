import Link from "next/link";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger"
  | "success";
export type ButtonSize = "sm" | "md" | "lg";

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-brand text-brand-fg hover:bg-brand-700 dark:hover:bg-brand-300",
  secondary:
    "border border-border-strong text-fg hover:bg-surface-hover bg-surface",
  ghost: "text-fg-muted hover:text-fg hover:bg-surface-hover",
  danger: "bg-danger text-white hover:brightness-110",
  success: "bg-success text-white hover:brightness-110",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium " +
  "transition-colors disabled:cursor-not-allowed disabled:opacity-50";

function classes(
  variant: ButtonVariant,
  size: ButtonSize,
  fullWidth: boolean,
  className?: string
) {
  return cn(BASE, VARIANTS[variant], SIZES[size], fullWidth && "w-full", className);
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={classes(variant, size, fullWidth, className)}
      {...props}
    />
  );
}

type ButtonLinkProps = React.ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
};

/** A Link that looks like a Button — keeps navigation semantics intact. */
export function ButtonLink({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={classes(variant, size, fullWidth, className)} {...props} />
  );
}
