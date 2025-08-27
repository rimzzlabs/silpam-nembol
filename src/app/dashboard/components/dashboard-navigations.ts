import { pipe, S } from "@mobily/ts-belt";
import {
  BanknoteIcon,
  BitcoinIcon,
  CandlestickChart,
  DollarSignIcon,
  ListTree,
  Settings2,
  UserLockIcon,
  UsersIcon,
  WalletCardsIcon,
  type LucideIcon,
} from "lucide-react";

export type DashboardNavigation = {
  label: string;
  pathname: string;
  icon: LucideIcon;
  subItems?: Array<{
    label: string;
    pathname: string;
    icon: LucideIcon;
  }>;
};

let buildPathname = (pathname: string) => {
  return pipe(pathname, S.prepend("/dashboard"));
};

export const DASHBOARD_NAVIGATIONS = [
  {
    label: "Users Management",
    pathname: buildPathname("/user"),
    icon: UsersIcon,
  },
  {
    label: "Admins",
    pathname: buildPathname("/admin"),
    icon: UserLockIcon,
  },
  // {
  // 	label: "KYC",
  // 	pathname: buildPathname("/kyc"),
  // 	icon: ScanFaceIcon,
  // },
  {
    pathname: buildPathname("/deposit"),
    label: "Deposit",
    icon: BanknoteIcon,
    subItems: [
      {
        label: "Fiat",
        icon: DollarSignIcon,
        pathname: buildPathname("/deposit/fiat"),
      },
      {
        label: "Crypto",
        icon: BitcoinIcon,
        pathname: buildPathname("/deposit/crypto"),
      },
    ],
  },
  {
    pathname: buildPathname("/withdrawal"),
    label: "Withdrawal",
    icon: WalletCardsIcon,
    subItems: [
      {
        label: "Crypto",
        icon: BitcoinIcon,
        pathname: buildPathname("/withdrawal/crypto"),
      },
      {
        label: "Fiat",
        icon: DollarSignIcon,
        pathname: buildPathname("/withdrawal/fiat"),
      },
    ],
  },
  {
    label: "Trade History",
    pathname: buildPathname("/trade"),
    icon: CandlestickChart,
    subItems: [
      {
        label: "Trade Management",
        pathname: buildPathname("/trade/manage"),
        icon: CandlestickChart,
      },
      {
        label: "Trade History",
        pathname: buildPathname("/trade/history"),
        icon: CandlestickChart,
      },
    ],
  },
  {
    label: "OTC Portal Settings",
    pathname: buildPathname("/settings"),
    icon: Settings2,
  },
  {
    label: "Affiliate",
    pathname: buildPathname("/affiliate"),
    icon: ListTree,
  },
] satisfies DashboardNavigation[];
