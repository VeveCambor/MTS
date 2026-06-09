"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { Navbar } from "./Navbar";
import { Sidebar, BottomNav } from "./Sidebar";
import { Footer } from "./Footer";
import { FuturisticBackground } from "@/components/ui/FuturisticBackground";
import { contentPaddingLeft, layout, radius } from "@/styles/tokens";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const plDesktop = contentPaddingLeft();

  return (
    <Box sx={{ minHeight: "100vh", position: "relative" }}>
      <FuturisticBackground />
      <Navbar onMenuClick={() => setMobileOpen((v) => !v)} />

      <Sidebar variant="rail" />
      <BottomNav />

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { md: "none" } }}
        slotProps={{
          paper: { sx: { width: 280, borderRadius: `0 ${radius.lg} ${radius.lg} 0` } },
        }}
      >
        <Sidebar variant="drawer" onNavigate={() => setMobileOpen(false)} />
      </Drawer>

      <Box
        component="main"
        sx={{
          position: "relative",
          zIndex: 1,
          pt: `${layout.topOffset}px`,
          pb: { xs: `${layout.bottomBarHeight + 24}px`, md: 5 },
          pl: { xs: layout.pagePaddingX.xs, md: `${plDesktop}px` },
          pr: layout.pagePaddingX,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ flexGrow: 1, maxWidth: layout.maxContentWidth, mx: "auto", width: "100%" }}>
          {children}
        </Box>
        <Footer />
      </Box>
    </Box>
  );
}
