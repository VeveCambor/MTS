"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { FuturisticBackground } from "@/components/ui/FuturisticBackground";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: { xs: 4, md: 8 },
        px: 2,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <FuturisticBackground />

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        <Box sx={{ textAlign: "center", mb: { xs: 3, md: 5 } }}>
          <Typography
            variant="overline"
            sx={{
              display: "block",
              letterSpacing: "0.18em",
              fontWeight: 600,
              fontSize: "0.7rem",
              color: "text.secondary",
              mb: 1,
            }}
          >
          </Typography>
          <Typography
            variant="h1"
            color="text.primary"
            sx={{
              fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4rem" },
              fontWeight: 800,
              lineHeight: 1.1,
              mb: 1,
              letterSpacing: "-0.03em",
            }}
          >
            My Training Space
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ letterSpacing: "0.02em" }}>
            Aplikace pro plánování tréninků mezi trenérem a sportovci.
          </Typography>
        </Box>
        {children}
      </Container>
    </Box>
  );
}
