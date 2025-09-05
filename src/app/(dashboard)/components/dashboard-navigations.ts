import { A, F, pipe } from "@mobily/ts-belt";
import {
  FileIcon,
  FilePlusIcon,
  LayoutDashboard,
  Megaphone,
  type LucideIcon,
} from "lucide-react";

export type DashboardNavigation = {
  label: string;
  pathname: string;
  icon: LucideIcon;
  role: string;
  subItems?: Array<{
    label: string;
    pathname: string;
    icon: LucideIcon;
  }>;
};

export const DASHBOARD_NAVIGATIONS = [
  {
    icon: Megaphone,
    role: "admin",
    label: "Daftar aduan",
    pathname: "/admin/complaint",
  },
  {
    label: "Laporan",
    icon: FileIcon,
    role: "admin",
    pathname: "/admin/report",
  },
  {
    icon: Megaphone,
    role: "user",
    label: "Aduan saya",
    pathname: "/user/complaint",
  },
  {
    role: "user",
    icon: FilePlusIcon,
    label: "Buat aduan baru",
    pathname: "/user/complaint/new",
  },
] satisfies DashboardNavigation[];

export function getDashboardNavigations(role?: string) {
  if (role === "admin") {
    return pipe(
      DASHBOARD_NAVIGATIONS,
      A.filter((nav) => nav.role === "admin"),
      A.prepend({
        role: "global",
        icon: LayoutDashboard,
        label: "Dashboard",
        pathname: "/admin",
      }),
      F.toMutable,
    );
  }

  if (role === "user") {
    return pipe(
      DASHBOARD_NAVIGATIONS,
      A.filter((nav) => nav.role === "user"),
      A.prepend({
        role: "global",
        icon: LayoutDashboard,
        label: "Dashboard",
        pathname: "/user",
      }),
      F.toMutable,
    );
  }

  return [];
}
