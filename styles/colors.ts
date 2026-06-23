import type { ColorMode } from "./tokens";

/** Sjednocená barevná paleta — pozadí, povrchy, okraje. */
export const colors = {
  light: {
    /** Světlé pozadí s mírným fialovo-modrým nádechem */
    bgGradient:
      "linear-gradient(165deg, #FAF9FE 0%, #F3F0FF 26%, #EFF6FF 58%, #F7FAFC 100%)",
    surface: "#FFFFFF",
    surfaceMuted: "#FAFAFC",
    surfaceGlass: "rgba(255, 255, 255, 0.60)",
    shellGlass: "rgba(255, 255, 255, 0.66)",
    border: "rgba(255, 255, 255, 0.75)",
    borderStrong: "rgba(139, 92, 246, 0.18)",
    inputBg: "rgba(255, 255, 255, 0.75)",
    cardGradient:
      "linear-gradient(148deg, rgba(255,255,255,0.80) 0%, rgba(255,255,255,0.55) 52%, rgba(243,240,255,0.38) 100%)",
    glassGradient:
      "linear-gradient(148deg, rgba(255,255,255,0.84) 0%, rgba(255,255,255,0.60) 100%)",
    orb1: "rgba(139, 92, 246, 0.17)",
    orb2: "rgba(56, 189, 248, 0.14)",
    orb3: "rgba(167, 139, 250, 0.09)",
    orb4: "rgba(129, 140, 248, 0.11)",
    grid: "rgba(91, 33, 182, 0.045)",
    hover: "rgba(139, 92, 246, 0.065)",
    tableHead: "rgba(255, 255, 255, 0.56)",
    mesh1: "rgba(167, 139, 250, 0.22)",
    mesh2: "rgba(56, 189, 248, 0.16)",
    mesh3: "rgba(167, 139, 250, 0.08)",
    mesh4: "rgba(129, 140, 248, 0.13)",
  },
  dark: {
    /** Stejná modro-slate rodina jako karty (#1E293B) — bez fialového nádechu */
    bgGradient: "linear-gradient(165deg, #0B1220 0%, #0F172A 38%, #162032 100%)",
    surface: "#1A2332",
    surfaceMuted: "#1E293B",
    surfaceElevated: "#243044",
    surfaceGlass: "rgba(26, 35, 50, 0.80)",
    shellGlass: "rgba(22, 30, 46, 0.78)",
    border: "rgba(148, 163, 184, 0.14)",
    borderStrong: "rgba(148, 163, 184, 0.20)",
    inputBg: "rgba(11, 18, 32, 0.65)",
    cardGradient:
      "linear-gradient(145deg, rgba(30,41,59,0.95) 0%, rgba(22,32,50,0.92) 100%)",
    glassGradient:
      "linear-gradient(145deg, rgba(30,41,59,0.88) 0%, rgba(26,35,50,0.82) 100%)",
    orb1: "rgba(153, 255, 236, 0.07)",
    orb2: "rgba(56, 132, 182, 0.09)",
    orb3: "rgba(100, 116, 139, 0.11)",
    orb4: "rgba(100, 116, 139, 0.08)",
    grid: "rgba(148, 163, 184, 0.05)",
    hover: "rgba(153, 255, 236, 0.05)",
    tableHead: "rgba(22, 32, 50, 0.85)",
    mesh1: "transparent",
    mesh2: "transparent",
    mesh3: "transparent",
    mesh4: "transparent",
  },
} as const;

export function getColors(mode: ColorMode) {
  return colors[mode];
}
