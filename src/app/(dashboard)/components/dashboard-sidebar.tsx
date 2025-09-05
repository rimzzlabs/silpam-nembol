"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";

import { DashboardSidebarLogout } from "./dashboard-sidebar-logout";
import dynamic from "next/dynamic";
import { Fragment } from "react";

let DashboardSidebarMenu = dynamic(
  () => import("./dashboard-sidebar-menu").then((m) => m.DashboardSidebarMenu),
  {
    ssr: false,
    loading: () => {
      return (
        <Fragment>
          <SidebarMenuSkeleton />
          <SidebarMenuSkeleton />
          <SidebarMenuSkeleton />
        </Fragment>
      );
    },
  },
);

export function DashboardSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="px-6 h-16 justify-center">
        <p className="text-sm font-semibold text-muted-foreground">
          SILPAM NEMBOL
        </p>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <DashboardSidebarMenu />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarFooter>
          <DashboardSidebarLogout />
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
