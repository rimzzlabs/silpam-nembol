"use client";

import { SidebarMenu, SidebarMenuSkeleton } from "@/components/ui/sidebar";
import { getDashboardNavigations } from "./dashboard-navigations";
import { DashboardSidebarMenuItem } from "./dashboard-sidebar-menu-item";
import { useProfile } from "@/modules/profile/query";
import { Fragment } from "react";

export function DashboardSidebarMenu() {
  let profileQuery = useProfile();

  let navigations = getDashboardNavigations(profileQuery.data?.data?.role);

  if (profileQuery.isPending || profileQuery.isError) {
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
