import { createTheme, type ThemeOptions } from "@mui/material/styles";

export type ColorMode = "light" | "dark";

const sharedOptions: ThemeOptions = {
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: "var(--font-geist-sans), system-ui, -apple-system, sans-serif",
    h1: { fontSize: "2rem", fontWeight: 700 },
    h2: { fontSize: "1.5rem", fontWeight: 700 },
    h3: { fontSize: "1.25rem", fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiButton: { defaultProps: { disableElevation: true } },
    MuiCard: { defaultProps: { variant: "outlined" } },
    MuiTextField: { defaultProps: { size: "small", fullWidth: true } },
  },
};

const palettes: Record<ColorMode, ThemeOptions["palette"]> = {
  light: {
    mode: "light",
    primary: { main: "#2563eb" },
    secondary: { main: "#7c3aed" },
    background: { default: "#f5f6f8", paper: "#ffffff" },
  },
  dark: {
    mode: "dark",
    primary: { main: "#60a5fa" },
    secondary: { main: "#a78bfa" },
    background: { default: "#0f1115", paper: "#171a21" },
  },
};

export function buildTheme(mode: ColorMode) {
  return createTheme({ ...sharedOptions, palette: palettes[mode] });
}
