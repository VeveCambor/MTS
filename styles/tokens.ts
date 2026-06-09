export type ColorMode = "light" | "dark";

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
  return {
    sm: isLight
      ? "0 1px 3px rgba(15, 23, 42, 0.06)"
      : "0 1px 3px rgba(0, 0, 0, 0.25)",
    md: isLight
      ? "0 4px 16px rgba(15, 23, 42, 0.08)"
      : "0 4px 20px rgba(0, 0, 0, 0.35)",
    lg: isLight
      ? "0 8px 32px rgba(15, 23, 42, 0.10)"
      : "0 8px 40px rgba(0, 0, 0, 0.45)",
    shell: isLight
      ? "0 2px 12px rgba(15, 23, 42, 0.06)"
      : "0 4px 24px rgba(0, 0, 0, 0.4)",
  };
}

/** Jemný neon glow kolem aktivních prvků — ne lišta, jen světlo. */
export function neonGlow(mode: ColorMode, intensity: "soft" | "medium" = "soft") {
  const isLight = mode === "light";
  if (intensity === "medium") {
    return isLight
      ? "0 0 0 1px rgba(91, 33, 182, 0.18), 0 0 24px rgba(91, 33, 182, 0.14)"
      : "0 0 0 1px rgba(153, 255, 236, 0.22), 0 0 28px rgba(153, 255, 236, 0.14)";
  }
  return isLight
    ? "0 0 0 1px rgba(91, 33, 182, 0.12), 0 0 14px rgba(91, 33, 182, 0.08)"
    : "0 0 0 1px rgba(153, 255, 236, 0.16), 0 0 18px rgba(153, 255, 236, 0.10)";
}

export function shellTokens(mode: ColorMode) {
  const isLight = mode === "light";
  const shadows = surfaceShadows(mode);

  return {
    shellRadius: radius.xl,
    navbarBg: isLight ? "rgba(255, 255, 255, 0.72)" : "rgba(30, 41, 59, 0.75)",
    sidebarBg: isLight ? "rgba(255, 255, 255, 0.65)" : "rgba(30, 41, 59, 0.70)",
    glassCard: isLight ? "rgba(255, 255, 255, 0.72)" : "rgba(30, 41, 59, 0.75)",
    glassBorder: isLight ? "rgba(255, 255, 255, 0.85)" : "rgba(255, 255, 255, 0.10)",
    glassBorderOuter: isLight ? "rgba(15, 23, 42, 0.08)" : "rgba(255, 255, 255, 0.08)",
    glassActive: isLight ? "rgba(255, 255, 255, 0.85)" : "rgba(255, 255, 255, 0.10)",
    glassHover: isLight ? "rgba(255, 255, 255, 0.55)" : "rgba(255, 255, 255, 0.06)",
    accent: isLight ? "#5B21B6" : "#99FFEC",
    accentRgb: isLight ? "91, 33, 182" : "153, 255, 236",
    iconColor: isLight ? "#64748B" : "#94A3B8",
    iconHover: isLight ? "#5B21B6" : "#F8FAFC",
    hoverLift: "translateY(-2px)",
    shadows,
    orb1: isLight ? "rgba(91, 33, 182, 0.12)" : "rgba(153, 255, 236, 0.08)",
    orb2: isLight ? "rgba(125, 211, 252, 0.15)" : "rgba(91, 33, 182, 0.10)",
    orb3: isLight ? "rgba(196, 101, 255, 0.10)" : "rgba(125, 211, 252, 0.08)",
    gridColor: isLight ? "rgba(15, 23, 42, 0.04)" : "rgba(255, 255, 255, 0.04)",
  };
}

export function glassPanelSx(mode: ColorMode) {
  const tokens = shellTokens(mode);
  return {
    backdropFilter: "blur(20px) saturate(180%)",
    WebkitBackdropFilter: "blur(20px) saturate(180%)",
    border: `1px solid ${tokens.glassBorderOuter}`,
    boxShadow: tokens.shadows.shell,
  };
}

/** Futuristický glass panel — vnitřní odlesk bez barevné lišty. */
export function futuristicGlassSx(mode: ColorMode) {
  const isLight = mode === "light";
  return {
    overflow: "hidden" as const,
    ...glassPanelSx(mode),
    boxShadow: `${surfaceShadows(mode).shell}, inset 0 1px 0 ${isLight ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.08)"}`,
  };
}

/** Kruhové ikonové tlačítko v sidebaru / bottom nav. */
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

/** Jemný průlet světla přes skleněný panel. */
export function glassShimmerSx(mode: ColorMode) {
  const isLight = mode === "light";
  return {
    "&::after": {
      content: '""',
      position: "absolute",
      top: 0,
      left: "-120%",
      width: "60%",
      height: "100%",
      background: isLight
        ? "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.45) 50%, transparent 60%)"
        : "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)",
      transform: "skewX(-18deg)",
      animation: "glass-shimmer 9s ease-in-out infinite",
      pointerEvents: "none",
    },
  };
}
