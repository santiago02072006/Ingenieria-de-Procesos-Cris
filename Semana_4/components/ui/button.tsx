import Link from "next/link";
import { type ComponentProps, forwardRef } from "react";

export type ButtonVariant = "primary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500",
  outline:
    "border border-zinc-700 bg-zinc-950/50 text-zinc-100 hover:border-indigo-500/40 hover:bg-zinc-900/80",
  ghost:
    "text-zinc-300 hover:bg-zinc-900/70 hover:text-indigo-300",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "gap-1.5 rounded-lg px-3 py-1.5 text-sm",
  md: "gap-2 rounded-lg px-4 py-2 text-sm",
  lg: "gap-2 rounded-xl px-6 py-3 text-base",
};

export function buttonClassName(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className = "",
): string {
  return [
    "inline-flex items-center justify-center font-medium transition-colors",
    "disabled:pointer-events-none disabled:opacity-45",
    variantClasses[variant],
    sizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

export type ButtonProps = ComponentProps<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", href, type = "button", children, ...props }, ref) => {
    const classes = buttonClassName(variant, size, className);

    if (href) {
      return (
        <Link href={href} className={classes}>
          {children}
        </Link>
      );
    }

    return (
      <button ref={ref} type={type} className={classes} {...props}>
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
