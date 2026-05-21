import Link from "next/link";
import { type ComponentProps, forwardRef } from "react";

export type ButtonVariant = "primary" | "outline" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white shadow-lg shadow-primary hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
  outline:
    "border border-app-strong bg-app-card-50 text-app-foreground hover:border-app hover:bg-app-card-60",
  ghost:
    "text-app-muted hover:bg-app-card-60 hover:text-primary",
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
