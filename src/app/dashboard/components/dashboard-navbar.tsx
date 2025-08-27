import { SidebarTrigger } from "@/components/ui/sidebar";

export function DashboardNavbar() {
  return (
    <header className="sticky top-0 inset-x-0 z-30 flex items-center justify-between h-16 border-b px-6 md:px-8 lg:px-10 bg-background">
      <SidebarTrigger />
    </header>
  );
}
