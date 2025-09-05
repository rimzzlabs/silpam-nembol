import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

export function Title(props: ComponentPropsWithoutRef<"h1">) {
  return (
    <h1 {...props} className={cn("text-2xl font-bold", props.className)} />
  );
}
