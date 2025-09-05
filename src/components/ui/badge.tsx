import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        warning:
          "border-transparent bg-yellow-700 text-white [a&]:hover:bg-yellow-700/90 focus-visible:ring-yellow-700/20 dark:focus-visible:ring-yellow-700/40 dark:bg-yellow-700/60",
        success:
          "border-transparent bg-emerald-700 text-white [a&]:hover:bg-emerald-700/90 focus-visible:ring-emerald-700/20 dark:focus-visible:ring-emerald-700/40 dark:bg-emerald-700/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      },
      size: {
        default: "px-2 py-0.5",
        sm: "px-1.5 py-px",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type BadgeVariants = VariantProps<typeof badgeVariants>["variant"];

function Badge({
  className,
  size,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
