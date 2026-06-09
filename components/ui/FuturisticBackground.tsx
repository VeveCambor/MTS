"use client";

import Box from "@mui/material/Box";
import { useColorMode } from "@/components/providers/ColorModeProvider";
import { shellTokens } from "@/styles/tokens";

/**
 * Animované futuristické pozadí — mřížka, plovoucí orby, scan line.
 * Vždy pod obsahem, neblokuje interakci.
 */
export function FuturisticBackground() {
  const { mode } = useColorMode();
  const tokens = shellTokens(mode);

  return (
    <Box
      aria-hidden
      sx={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
    >
      {/* Dot grid */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          opacity: mode === "light" ? 0.55 : 0.35,
          backgroundImage: `radial-gradient(circle, ${tokens.gridColor} 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse 80% 70% at 50% 40%, black 20%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 40%, black 20%, transparent 75%)",
        }}
      />

      {/* Plovoucí orby */}
      <Box
        className="futuristic-orb futuristic-orb--1"
        sx={{
          position: "absolute",
          width: 420,
          height: 420,
          borderRadius: "50%",
          top: "-8%",
          right: "-5%",
          background: `radial-gradient(circle, ${tokens.orb1} 0%, transparent 68%)`,
          filter: "blur(40px)",
          animation: "float-orb 18s ease-in-out infinite",
        }}
      />
      <Box
        className="futuristic-orb futuristic-orb--2"
        sx={{
          position: "absolute",
          width: 360,
          height: 360,
          borderRadius: "50%",
          bottom: "5%",
          left: "-4%",
          background: `radial-gradient(circle, ${tokens.orb2} 0%, transparent 68%)`,
          filter: "blur(48px)",
          animation: "float-orb 22s ease-in-out infinite reverse",
        }}
      />
      <Box
        className="futuristic-orb futuristic-orb--3"
        sx={{
          position: "absolute",
          width: 280,
          height: 280,
          borderRadius: "50%",
          top: "42%",
          left: "38%",
          background: `radial-gradient(circle, ${tokens.orb3} 0%, transparent 70%)`,
          filter: "blur(56px)",
          animation: "float-orb 26s ease-in-out infinite 2s",
        }}
      />

      {/* Jemná scan line */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          opacity: mode === "light" ? 0.025 : 0.04,
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 3px,
            rgba(var(--accent-rgb), 0.15) 3px,
            rgba(var(--accent-rgb), 0.15) 4px
          )`,
          animation: "scan-drift 12s linear infinite",
        }}
      />
    </Box>
  );
}
