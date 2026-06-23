"use client";

import Box from "@mui/material/Box";
import { useColorMode } from "@/components/providers/ColorModeProvider";
import { getColors } from "@/styles/colors";
import { shellTokens } from "@/styles/tokens";

/**
 * Animované futuristické pozadí — mesh aurora, mřížka, plovoucí orby.
 * Ve světlém režimu bohatší barevné skvrny; scan line jen v dark mode.
 */
export function FuturisticBackground() {
  const { mode } = useColorMode();
  const tokens = shellTokens(mode);
  const c = getColors(mode);
  const isLight = mode === "light";

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
      {/* Aurora mesh — hlavně light mode */}
      {isLight && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            opacity: 0.88,
            background: `
              radial-gradient(ellipse 85% 65% at 12% 8%, ${c.mesh1}, transparent 58%),
              radial-gradient(ellipse 75% 55% at 88% 15%, ${c.mesh2}, transparent 52%),
              radial-gradient(ellipse 65% 50% at 72% 88%, ${c.mesh3}, transparent 48%),
              radial-gradient(ellipse 55% 45% at 22% 78%, ${c.mesh4}, transparent 42%)
            `,
          }}
        />
      )}

      {/* Dot grid */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          opacity: isLight ? 0.36 : 0.35,
          backgroundImage: `radial-gradient(circle, ${tokens.gridColor} 1px, transparent 1px)`,
          backgroundSize: isLight ? "32px 32px" : "28px 28px",
          maskImage: "radial-gradient(ellipse 85% 75% at 50% 42%, black 15%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(ellipse 85% 75% at 50% 42%, black 15%, transparent 78%)",
        }}
      />

      {/* Plovoucí orby */}
      <Box
        className="futuristic-orb futuristic-orb--1"
        sx={{
          position: "absolute",
          width: isLight ? 500 : 420,
          height: isLight ? 500 : 420,
          borderRadius: "50%",
          top: "-10%",
          right: "-6%",
          background: `radial-gradient(circle, ${tokens.orb1} 0%, transparent 68%)`,
          filter: isLight ? "blur(56px)" : "blur(40px)",
          animation: "float-orb 18s ease-in-out infinite",
        }}
      />
      <Box
        className="futuristic-orb futuristic-orb--2"
        sx={{
          position: "absolute",
          width: isLight ? 420 : 360,
          height: isLight ? 420 : 360,
          borderRadius: "50%",
          bottom: "2%",
          left: "-5%",
          background: `radial-gradient(circle, ${tokens.orb2} 0%, transparent 68%)`,
          filter: isLight ? "blur(64px)" : "blur(48px)",
          animation: "float-orb 22s ease-in-out infinite reverse",
        }}
      />
      <Box
        className="futuristic-orb futuristic-orb--3"
        sx={{
          position: "absolute",
          width: isLight ? 340 : 280,
          height: isLight ? 340 : 280,
          borderRadius: "50%",
          top: "40%",
          left: "36%",
          background: `radial-gradient(circle, ${tokens.orb3} 0%, transparent 70%)`,
          filter: isLight ? "blur(72px)" : "blur(56px)",
          animation: "float-orb 26s ease-in-out infinite 2s",
        }}
      />
      {isLight && (
        <Box
          className="futuristic-orb futuristic-orb--4"
          sx={{
            position: "absolute",
            width: 380,
            height: 380,
            borderRadius: "50%",
            top: "55%",
            right: "18%",
            background: `radial-gradient(circle, ${c.orb4} 0%, transparent 70%)`,
            filter: "blur(68px)",
            animation: "float-orb 30s ease-in-out infinite 4s",
          }}
        />
      )}

      {/* Scan line — jen dark mode (ve světlém působí rušivě) */}
      {!isLight && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            opacity: 0.04,
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
      )}
    </Box>
  );
}
