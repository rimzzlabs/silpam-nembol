"use client";

import { SidebarMenu, SidebarMenuSkeleton } from "@/components/ui/sidebar";
import { getDashboardNavigations } from "./dashboard-navigations";
import { DashboardSidebarMenuItem } from "./dashboard-sidebar-menu-item";
import { Fragment } from "react";
import { useSession } from "@/modules/auth/hooks";

export function DashboardSidebarMenu() {
  let sessionQuery = useSession();

  let navigations = getDashboardNavigations(sessionQuery.data?.userRole);

  if (sessionQuery.isPending || sessionQuery.isError) {
    return (
      <Fragment>
        <SidebarMenuSkeleton />
        <SidebarMenuSkeleton />
        <SidebarMenuSkeleton />
      </Fragment>
    );
  }

  return (
    <SidebarMenu>
      {navigations.map((navItem) => (
        <DashboardSidebarMenuItem key={navItem.label} {...navItem} />
      ))}
    </SidebarMenu>
  );
}
