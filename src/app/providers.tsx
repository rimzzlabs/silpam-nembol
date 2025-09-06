"use client";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProgressBar } from "next-nprogress-bar";
import { ThemeProvider } from "next-themes";
import type { PropsWithChildren } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export function Providers(props: PropsWithChildren) {
  let client = getQueryClient();

  return (
    <NuqsAdapter>
      <QueryClientProvider client={client}>
        <ThemeProvider
          enableSystem
          attribute="class"
          forcedTheme="dark"
          enableColorScheme
          storageKey="app.theme"
        >
          <TooltipProvider delayDuration={250}>
            {props.children}
          </TooltipProvider>

          <AppProgressBar
            height="4px"
            color="#fc8c03"
            shallowRouting
            options={{ showSpinner: false }}
          />

          <ReactQueryDevtools />

          <Toaster />
        </ThemeProvider>
      </QueryClientProvider>
    </NuqsAdapter>
  );
}
