"use client";

import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import type { DashboardNavigation } from "./dashboard-navigations";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRightIcon } from "lucide-react";
import { useToggle } from "@/hooks/use-toggle";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function DashboardSidebarMenuItem(props: DashboardNavigation) {
  let [open, onToggle] = useToggle();
  let pathname = usePathname();

  let onToggleChange = (open: boolean) => onToggle(open);

  let isPathnameActive = (p: string) => {
    return pathname.includes(p) && pathname.endsWith(p);
  };

  if (!props.subItems) {
    return (
      <SidebarMenuItem className="gap-4">
        <SidebarMenuButton
          asChild
          className={cn(
            "h-10 px-4 transition",
            isPathnameActive(props.pathname) &&
              "bg-sidebar-accent text-sidebar-accent-foreground",
          )}
        >
          <Link href={props.pathname} rel="noopener">
            <props.icon className="size-4" /> {props.label}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }
  return (
    <Collapsible open={open} onOpenChange={onToggleChange}>
      <SidebarMenuItem className="gap-4">
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            className={cn(
              "group h-10 px-4 transition cursor-pointer",
              isPathnameActive(props.pathname) &&
                "bg-sidebar-accent text-sidebar-accent-foreground",
            )}
          >
            <props.icon className="size-4" /> {props.label}{" "}
            <ChevronRightIcon
              className={cn("ml-auto size-3.5 transition", open && "rotate-90")}
            />
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub>
            {props.subItems.map((item) => (
              <SidebarMenuSubItem key={item.label}>
                <SidebarMenuSubButton asChild>
                  <Link href={item.pathname} rel="noopener">
                    <item.icon className="size-4" /> {item.label}
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
