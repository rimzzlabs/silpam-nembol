import * as React from "react";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { EyeIcon, EyeOffIcon, type LucideIcon } from "lucide-react";
import { Button } from "./button";

const inputVariants = cva(
  "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex w-full min-w-0 rounded-md border bg-transparent text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      scale: {
        default: "h-9 px-3 py-1",
        lg: "h-10 px-4 py-1.5",
      },
    },
    defaultVariants: { scale: "default" },
  },
);

function Input({
  className,
  type,
  scale,
  ...props
}: React.ComponentProps<"input"> & VariantProps<typeof inputVariants>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={inputVariants({ className, scale })}
      {...props}
    />
  );
}

function InputPassword({
  className,
  scale = "default",
  prefixIcon: PrefixIcon,
  ...props
}: Omit<React.ComponentProps<"input">, "type"> &
  VariantProps<typeof inputVariants> & { prefixIcon?: LucideIcon }) {
  let [visible, setVisible] = React.useState(false);

  return (
    <div className="relative">
      <input
        {...props}
        data-slot="input"
        autoComplete="current-password"
        type={visible ? "text" : "password"}
        className={cn(
          inputVariants({ className, scale }),
          "pr-10",
          PrefixIcon && "pl-10",
        )}
      />

      {PrefixIcon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          {<PrefixIcon className="size-4" />}
        </div>
      )}

      <Button
        type="button"
        tabIndex={-1}
        variant="ghost"
        onClick={() => setVisible((v) => !v)}
        className={cn(
          "p-0 absolute right-0.5 top-0.5 bottom-0.5 aspect-square h-auto",
        )}
      >
        {visible ? (
          <EyeIcon className="size-4" />
        ) : (
          <EyeOffIcon className="size-4" />
        )}
        <span className="sr-only">Toggle password visibility</span>
      </Button>
    </div>
  );
}

export { Input, InputPassword };
