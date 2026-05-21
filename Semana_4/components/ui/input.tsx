import { type ComponentProps, forwardRef, useId } from "react";

export type InputProps = Omit<ComponentProps<"input">, "id"> & {
  label?: string;
  error?: string;
  id?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, id: idProp, ...props }, ref) => {
    const autoId = useId();
    const id = idProp ?? `field-${autoId}`;

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label ? (
          <label htmlFor={id} className="text-sm font-medium text-zinc-300">
            {label}
          </label>
        ) : null}
        <input
          ref={ref}
          id={id}
          className={[
            "w-full rounded-lg border border-zinc-800 bg-zinc-900/55 px-3 py-2 text-sm text-zinc-100",
            "placeholder:text-zinc-500",
            "transition-colors focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500",
            error ? "border-red-500/70 focus:border-red-500 focus:ring-red-500" : "",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
        {error ? (
          <p id={`${id}-error`} className="text-xs text-red-400" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";
