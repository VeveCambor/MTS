import type { ColorMode } from "./tokens";

/** Sjednocená barevná paleta — pozadí, povrchy, okraje. */
export const colors = {
  light: {
    bgGradient: "linear-gradient(160deg, #EEF2F7 0%, #E2E8F0 45%, #DCE4EE 100%)",
    surface: "#FFFFFF",
    surfaceMuted: "#F8FAFC",
    surfaceGlass: "rgba(255, 255, 255, 0.78)",
    shellGlass: "rgba(255, 255, 255, 0.72)",
    border: "rgba(15, 23, 42, 0.10)",
    borderStrong: "rgba(15, 23, 42, 0.14)",
    inputBg: "rgba(255, 255, 255, 0.85)",
    cardGradient:
      "linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.94) 100%)",
    glassGradient:
      "linear-gradient(145deg, rgba(255,255,255,0.96) 0%, rgba(248,250,252,0.92) 100%)",
    orb1: "rgba(91, 33, 182, 0.10)",
    orb2: "rgba(125, 211, 252, 0.12)",
    orb3: "rgba(148, 163, 184, 0.14)",
    grid: "rgba(15, 23, 42, 0.05)",
    hover: "rgba(139, 92, 246, 0.06)",
    tableHead: "rgba(248, 250, 252, 0.92)",
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
    grid: "rgba(148, 163, 184, 0.05)",
    hover: "rgba(153, 255, 236, 0.05)",
    tableHead: "rgba(22, 32, 50, 0.85)",
  },
} as const;

export function getColors(mode: ColorMode) {
  return colors[mode];
}
