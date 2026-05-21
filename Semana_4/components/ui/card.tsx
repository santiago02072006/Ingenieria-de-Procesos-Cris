import { type ComponentProps } from "react";

export function Card({ className = "", ...props }: ComponentProps<"div">) {
  return (
    <div
      className={[
        "rounded-2xl border border-app bg-app-card-35 shadow-xl shadow-black/30 backdrop-blur-sm",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}

export function CardHeader({ className = "", ...props }: ComponentProps<"div">) {
  return <div className={["p-6 pb-0", className].filter(Boolean).join(" ")} {...props} />;
}

export function CardTitle({ className = "", ...props }: ComponentProps<"h3">) {
  return (
    <h3
      className={["text-lg font-semibold tracking-tight text-app-foreground", className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}

export function CardDescription({ className = "", ...props }: ComponentProps<"p">) {
  return (
    <p className={["mt-1 text-sm leading-relaxed text-app-muted", className].filter(Boolean).join(" ")} {...props} />
  );
}

export function CardContent({ className = "", ...props }: ComponentProps<"div">) {
  return <div className={["p-6 pt-4", className].filter(Boolean).join(" ")} {...props} />;
}
