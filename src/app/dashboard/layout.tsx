import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { PropsWithChildren } from "react";
import { DashboardSidebar } from "./components/dashboard-sidebar";
import { DashboardNavbar } from "./components/dashboard-navbar";

export default function Layout(props: PropsWithChildren) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <DashboardNavbar />
        <main className="p-6">{props.children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
