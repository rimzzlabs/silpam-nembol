import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { DashboardSidebarMenu } from "./dashboard-sidebar-menu";

export function DashboardSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="px-6">
        <p className="text-sm font-semibold text-muted-foreground">
          NEXT-TS DASHBOARD
        </p>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <DashboardSidebarMenu />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
