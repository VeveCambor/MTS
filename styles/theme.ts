import { createTheme, type ThemeOptions } from "@mui/material/styles";

export type ColorMode = "light" | "dark";

const FONT_FAMILY =
  "var(--font-inter), var(--font-poppins), system-ui, -apple-system, sans-serif";

const sharedOptions: ThemeOptions = {
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: FONT_FAMILY,
    h1: { fontSize: "2.5rem", fontWeight: 700 },
    h2: { fontSize: "2rem", fontWeight: 600 },
    h3: { fontSize: "1.5rem", fontWeight: 600 },
    body1: { lineHeight: 1.6 },
    body2: { lineHeight: 1.6 },
    button: { textTransform: "none", fontWeight: 600 },
  },
};

const LIGHT_BG = "linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)";
const DARK_BG = "linear-gradient(135deg, #0F172A 0%, #18172e 50%, #1E1B4B 100%)";

const palettes: Record<ColorMode, NonNullable<ThemeOptions["palette"]>> = {
  light: {
    mode: "light",
    primary: { main: "#5B21B6", contrastText: "#FFFFFF" },
    secondary: { main: "#8B5CF6", contrastText: "#FFFFFF" },
    background: { default: "#F1F5F9", paper: "#FFFFFF" },
    text: { primary: "#1F2937", secondary: "#6B7280" },
    divider: "#E2E8F0",
    success: { main: "#10B981" },
    error: { main: "#EF4444" },
  },
  dark: {
    mode: "dark",
    primary: { main: "#99FFEC", contrastText: "#1B1B3A" },
    secondary: { main: "#7DD3FC", contrastText: "#1B1B3A" },
    background: { default: "#0F172A", paper: "#1E293B" },
    text: { primary: "#F8FAFC", secondary: "#94A3B8" },
    divider: "#334155",
    success: { main: "#34D399" },
    error: { main: "#F87171" },
  },
};

function buildComponents(mode: ColorMode): ThemeOptions["components"] {
  const isLight = mode === "light";
  const pageBg = isLight ? LIGHT_BG : DARK_BG;
  const cardBg = isLight
    ? "linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)"
    : "#1E293B";
  const cardBorder = isLight ? "#E2E8F0" : "#334155";
  const cardShadow = isLight
    ? "0 4px 20px rgba(139, 92, 246, 0.10)"
    : "0 4px 20px rgba(0, 0, 0, 0.35)";

  return {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: pageBg,
          backgroundAttachment: "fixed",
          minHeight: "100vh",
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: ({ ownerState }) => ({
          borderRadius: 12,
          ...(ownerState.variant === "contained" &&
            ownerState.color === "primary" &&
            (isLight
              ? {
                  background: "linear-gradient(135deg, #4C1D95 0%, #5B21B6 100%)",
                  color: "#FFFFFF",
                  "&:hover": {
                    background: "linear-gradient(135deg, #5B21B6 0%, #6D28D9 100%)",
                  },
                }
              : {
                  background: "#99FFEC",
                  color: "#1B1B3A",
                  "&:hover": { background: "#7DD3FC" },
                })),
        }),
      },
    },
    MuiCard: {
      defaultProps: { variant: "outlined" },
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: `1px solid ${cardBorder}`,
          background: cardBg,
          boxShadow: cardShadow,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: { borderRadius: 16 },
      },
    },
    MuiTextField: { defaultProps: { size: "small", fullWidth: true } },
    MuiTableContainer: {
      styleOverrides: { root: { borderRadius: 12 } },
    },
    MuiTableCell: {
      styleOverrides: {
        head: { fontWeight: 600, fontSize: "0.9rem" },
      },
    },
  };
}

export function buildTheme(mode: ColorMode) {
  return createTheme({
    ...sharedOptions,
    palette: palettes[mode],
    components: buildComponents(mode),
  });
}
