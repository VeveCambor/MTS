export type ColorMode = "light" | "dark";

import { getColors } from "./colors";

export const radius = {
  sm: "4px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  full: "9999px",
} as const;

export const motion = {
  fast: "0.15s cubic-bezier(0.4, 0, 0.2, 1)",
  normal: "0.22s cubic-bezier(0.4, 0, 0.2, 1)",
  slow: "0.35s cubic-bezier(0.4, 0, 0.2, 1)",
} as const;

export const layout = {
  navbarHeight: 70,
  navbarTop: 12,
  sidebarWidth: 75,
  sidebarLeft: 16,
  contentGap: 32,
  topOffset: 124,
  bottomBarHeight: 72,
  maxContentWidth: 1400,
  pagePaddingX: { xs: 2, md: 3 },
} as const;

export function contentPaddingLeft(): number {
  return layout.sidebarLeft + layout.sidebarWidth + layout.contentGap;
}

export function surfaceShadows(mode: ColorMode) {
  const isLight = mode === "light";
  const c = getColors(mode);
  return {
    sm: isLight
      ? "0 2px 8px rgba(91, 33, 182, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04)"
      : "0 1px 3px rgba(0, 0, 0, 0.30)",
    md: isLight
      ? "0 8px 28px rgba(91, 33, 182, 0.10), 0 4px 12px rgba(15, 23, 42, 0.05)"
      : `0 4px 20px rgba(0, 0, 0, 0.35), 0 0 0 1px ${c.border}`,
    lg: isLight
      ? "0 16px 48px rgba(91, 33, 182, 0.14), 0 8px 20px rgba(15, 23, 42, 0.06)"
      : "0 8px 36px rgba(0, 0, 0, 0.45)",
    shell: isLight
      ? "0 8px 32px rgba(91, 33, 182, 0.09), 0 2px 8px rgba(15, 23, 42, 0.04), inset 0 1px 0 rgba(255,255,255,0.92)"
      : `0 4px 20px rgba(0, 0, 0, 0.35), 0 0 0 1px ${c.border}`,
  };
}

export function neonGlow(mode: ColorMode, intensity: "soft" | "medium" = "soft") {
  const isLight = mode === "light";
  if (intensity === "medium") {
    return isLight
      ? "0 0 0 1px rgba(91, 33, 182, 0.18), 0 0 24px rgba(91, 33, 182, 0.14)"
      : "0 0 0 1px rgba(153, 255, 236, 0.20), 0 0 24px rgba(153, 255, 236, 0.10)";
  }
  return isLight
    ? "0 0 0 1px rgba(91, 33, 182, 0.12), 0 0 14px rgba(91, 33, 182, 0.08)"
    : "0 0 0 1px rgba(153, 255, 236, 0.14), 0 0 16px rgba(153, 255, 236, 0.08)";
}

export function shellTokens(mode: ColorMode) {
  const c = getColors(mode);
  const shadows = surfaceShadows(mode);
  const isLight = mode === "light";

  return {
    shellRadius: radius.xl,
    navbarBg: c.shellGlass,
    sidebarBg: c.shellGlass,
    glassCard: c.surfaceGlass,
    glassBorder: isLight ? "rgba(255, 255, 255, 0.95)" : c.border,
    glassBorderOuter: isLight ? "rgba(255, 255, 255, 0.55)" : c.border,
    glassActive: isLight ? "rgba(255, 255, 255, 0.88)" : "rgba(36, 48, 68, 0.75)",
    glassHover: isLight ? "rgba(255, 255, 255, 0.55)" : "rgba(36, 48, 68, 0.45)",
    accent: isLight ? "#5B21B6" : "#99FFEC",
    accentRgb: isLight ? "91, 33, 182" : "153, 255, 236",
    iconColor: isLight ? "#64748B" : "#94A3B8",
    iconHover: isLight ? "#5B21B6" : "#E2FDF9",
    hoverLift: "translateY(-2px)",
    shadows,
    orb1: c.orb1,
    orb2: c.orb2,
    orb3: c.orb3,
    gridColor: c.grid,
  };
}

export function glassPanelSx(mode: ColorMode) {
  const tokens = shellTokens(mode);
  const isLight = mode === "light";
  return {
    backdropFilter: isLight ? "blur(24px) saturate(190%)" : "blur(20px) saturate(160%)",
    WebkitBackdropFilter: isLight ? "blur(24px) saturate(190%)" : "blur(20px) saturate(160%)",
    border: isLight
      ? `1px solid ${tokens.glassBorderOuter}`
      : `1px solid ${tokens.glassBorderOuter}`,
    boxShadow: tokens.shadows.shell,
  };
}

export function cardGlassSx(mode: ColorMode) {
  const c = getColors(mode);
  const shadows = surfaceShadows(mode);
  const isLight = mode === "light";
  return {
    position: "relative" as const,
    overflow: "hidden" as const,
    background: c.cardGradient,
    backdropFilter: isLight ? "blur(20px) saturate(185%)" : "blur(14px) saturate(150%)",
    WebkitBackdropFilter: isLight ? "blur(20px) saturate(185%)" : "blur(14px) saturate(150%)",
    border: `1px solid ${c.border}`,
    boxShadow: isLight
      ? `${shadows.sm}, inset 0 1px 0 rgba(255,255,255,0.88)`
      : shadows.sm,
    ...(isLight ? glassShimmerSx(mode) : {}),
  };
}

export function futuristicGlassSx(mode: ColorMode) {
  const isLight = mode === "light";
  const c = getColors(mode);
  return {
    overflow: "hidden" as const,
    ...glassPanelSx(mode),
    boxShadow: isLight
      ? `${surfaceShadows(mode).shell}, 0 0 0 1px ${c.borderStrong}, inset 0 1px 0 rgba(255,255,255,0.95)`
      : `${surfaceShadows(mode).shell}, inset 0 1px 0 rgba(148, 163, 184, 0.10)`,
  };
}

export function navIconButtonSx(mode: ColorMode, active: boolean) {
  const tokens = shellTokens(mode);
  return {
    width: 44,
    height: 44,
    borderRadius: "50%",
    color: active ? tokens.accent : tokens.iconColor,
    bgcolor: active ? tokens.glassActive : "transparent",
    backdropFilter: active ? "blur(12px)" : "none",
    border: `1px solid ${active ? tokens.glassBorderOuter : "transparent"}`,
    boxShadow: active ? neonGlow(mode) : "none",
    transition: `all ${motion.normal}`,
    ...(active && { animation: "neon-pulse 3s ease-in-out infinite" }),
    "&:hover": {
      color: tokens.iconHover,
      bgcolor: active ? tokens.glassActive : tokens.glassHover,
      backdropFilter: "blur(12px)",
      borderColor: tokens.glassBorderOuter,
      transform: tokens.hoverLift,
      boxShadow: neonGlow(mode, active ? "medium" : "soft"),
    },
  };
}

/** Probliknutí na kartách — ve světlém režimu pomalejší a jemnější. */
export function glassShimmerSx(mode: ColorMode) {
  if (mode === "dark") return {};

  return {
    "&::after": {
      content: '""',
      position: "absolute",
      top: 0,
      left: "-120%",
      width: "55%",
      height: "100%",
      background:
        "linear-gradient(105deg, transparent 42%, rgba(255,255,255,0.55) 50%, transparent 58%)",
      transform: "skewX(-18deg)",
      animation: "glass-shimmer 14s ease-in-out infinite",
      pointerEvents: "none",
    },
  };
}

/** Jemné probliknutí shell prvků (navbar, sidebar) — v dark mode pomalejší a slabší. */
export function shellShimmerSx(mode: ColorMode) {
  const isLight = mode === "light";
  return {
    "&::after": {
      content: '""',
      position: "absolute",
      top: 0,
      left: "-120%",
      width: "55%",
      height: "100%",
      background: isLight
        ? "linear-gradient(105deg, transparent 42%, rgba(255,255,255,0.35) 50%, transparent 58%)"
        : "linear-gradient(105deg, transparent 44%, rgba(148,163,184,0.05) 50%, transparent 56%)",
      transform: "skewX(-18deg)",
      animation: isLight
        ? "glass-shimmer 12s ease-in-out infinite"
        : "glass-shimmer 18s ease-in-out infinite",
      pointerEvents: "none",
    },
  };
}
