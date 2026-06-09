"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { ColorModeProvider } from "./ColorModeProvider";
import { QueryProvider } from "./QueryProvider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider options={{ key: "mui" }}>
      <QueryProvider>
        <ColorModeProvider>{children}</ColorModeProvider>
      </QueryProvider>
    </AppRouterCacheProvider>
  );
}
