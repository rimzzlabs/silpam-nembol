import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "./providers";

const interSans = Inter_Tight({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SILPAM Desa Nembol",
  description: "Sistem Informasi Layanan Pengaduan Desa Nembol",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" translate="no" suppressHydrationWarning>
      <body className={cn(interSans, "antialiased")}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
