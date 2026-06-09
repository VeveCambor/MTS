import { createTheme, type ThemeOptions } from "@mui/material/styles";
import { motion, neonGlow, radius, surfaceShadows, type ColorMode } from "./tokens";

export type { ColorMode };

const FONT_FAMILY =
  "var(--font-inter), var(--font-poppins), system-ui, -apple-system, sans-serif";

const sharedOptions: ThemeOptions = {
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: FONT_FAMILY,
    h1: { fontSize: "2.5rem", fontWeight: 700, lineHeight: 1.2 },
    h2: { fontSize: "2rem", fontWeight: 600, lineHeight: 1.25 },
    h3: { fontSize: "1.5rem", fontWeight: 600, lineHeight: 1.3 },
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
    ? "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.95) 100%)"
    : "linear-gradient(135deg, rgba(30,41,59,0.98) 0%, rgba(15,23,42,0.95) 100%)";
  const cardBorder = isLight ? "rgba(226, 232, 240, 0.9)" : "rgba(51, 65, 85, 0.8)";
  const shadows = surfaceShadows(mode);
  const accent = isLight ? "#8B5CF6" : "#99FFEC";
  const hoverBg = isLight ? "rgba(139, 92, 246, 0.05)" : "rgba(153, 255, 236, 0.06)";
  const glassPaper = isLight
    ? "linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(248,250,252,0.92) 100%)"
    : "linear-gradient(135deg, rgba(30,41,59,0.96) 0%, rgba(15,23,42,0.92) 100%)";

  return {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: pageBg,
          backgroundAttachment: "fixed",
          minHeight: "100vh",
        },
        "::selection": {
          background: isLight ? "rgba(139, 92, 246, 0.25)" : "rgba(153, 255, 236, 0.25)",
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: ({ ownerState }) => ({
          borderRadius: radius.full,
          padding: "10px 22px",
          transition: `transform ${motion.normal}, box-shadow ${motion.normal}, background ${motion.normal}`,
          "&:hover": { transform: "translateY(-1px)" },
          "&:active": { transform: "translateY(0)" },
          ...(ownerState.variant === "contained" &&
            ownerState.color === "primary" &&
            (isLight
              ? {
                  background: "#5B21B6",
                  color: "#FFFFFF",
                  boxShadow: shadows.sm,
                  "&:hover": {
                    background: "#6D28D9",
                    boxShadow: `${shadows.md}, ${neonGlow(mode, "soft")}`,
                  },
                }
              : {
                  background: "#99FFEC",
                  color: "#1B1B3A",
                  "&:hover": {
                    background: "#7DD3FC",
                    boxShadow: `${shadows.md}, ${neonGlow(mode, "soft")}`,
                  },
                })),
          ...(ownerState.variant === "outlined" && {
            borderColor: accent,
            color: accent,
            "&:hover": {
              borderColor: accent,
              bgcolor: hoverBg,
            },
          }),
        }),
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: radius.lg,
          transition: `all ${motion.normal}`,
        },
      },
    },
    MuiCard: {
      defaultProps: { variant: "outlined" },
      styleOverrides: {
        root: {
          borderRadius: radius.lg,
          border: `1px solid ${cardBorder}`,
          background: cardBg,
          boxShadow: shadows.sm,
          backdropFilter: "blur(12px) saturate(140%)",
          transition: `transform ${motion.normal}, box-shadow ${motion.normal}, border-color ${motion.normal}`,
          "&:hover": {
            boxShadow: shadows.md,
            borderColor: isLight ? "rgba(15, 23, 42, 0.12)" : "rgba(255, 255, 255, 0.14)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: { borderRadius: radius.lg },
        outlined: {
          borderRadius: radius.lg,
          border: `1px solid ${cardBorder}`,
        },
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          borderRadius: radius.lg,
          background: glassPaper,
          backdropFilter: "blur(20px) saturate(160%)",
          border: `1px solid ${isLight ? "rgba(15, 23, 42, 0.08)" : "rgba(255, 255, 255, 0.08)"}`,
          boxShadow: shadows.lg,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: radius.lg,
          background: glassPaper,
          backdropFilter: "blur(20px) saturate(160%)",
          border: `1px solid ${isLight ? "rgba(15, 23, 42, 0.08)" : "rgba(255, 255, 255, 0.08)"}`,
          boxShadow: shadows.lg,
          mt: 0.5,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: radius.lg,
          transition: `box-shadow ${motion.normal}, border-color ${motion.normal}`,
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: accent,
            borderWidth: 1.5,
          },
          "&.Mui-focused": {
            boxShadow: isLight
              ? "0 0 0 3px rgba(139, 92, 246, 0.12)"
              : "0 0 0 3px rgba(153, 255, 236, 0.12)",
          },
        },
      },
    },
    MuiTextField: { defaultProps: { size: "small", fullWidth: true } },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: radius.full,
          fontWeight: 500,
          transition: `background ${motion.fast}`,
        },
        filled: {
          bgcolor: isLight ? "rgba(139, 92, 246, 0.08)" : "rgba(153, 255, 236, 0.1)",
          color: isLight ? "#5B21B6" : "#99FFEC",
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: { root: { borderRadius: radius.md, overflow: "hidden" } },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          fontSize: "0.8125rem",
          letterSpacing: "0.02em",
          textTransform: "uppercase",
          borderColor: cardBorder,
          px: 2.5,
          py: 1.5,
          bgcolor: isLight ? "rgba(248, 250, 252, 0.9)" : "rgba(15, 23, 42, 0.5)",
        },
        root: {
          borderColor: cardBorder,
          px: 2.5,
          py: 1.75,
          transition: `background ${motion.fast}`,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": { bgcolor: hoverBg },
          "&:last-child td": { borderBottom: 0 },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          minHeight: 44,
          borderRadius: radius.sm,
          transition: `color ${motion.fast}`,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 2,
          borderRadius: radius.full,
          background: isLight ? "#5B21B6" : "#99FFEC",
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: `${radius.lg} !important`,
          border: `1px solid ${cardBorder}`,
          marginBottom: 8,
          "&:before": { display: "none" },
          boxShadow: shadows.sm,
          overflow: "hidden",
          transition: `box-shadow ${motion.normal}`,
          "&.Mui-expanded": { boxShadow: shadows.md },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: radius.md,
          transition: `background ${motion.fast}, transform ${motion.fast}`,
          "&:hover": { transform: "translateX(2px)" },
        },
      },
    },
    MuiSnackbarContent: {
      styleOverrides: {
        root: { borderRadius: radius.lg },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          borderRadius: radius.lg,
          backdropFilter: "blur(8px)",
          ...(isLight &&
            ownerState.severity === "success" && { bgcolor: "#D1FAE5", color: "#065F46" }),
          ...(isLight &&
            ownerState.severity === "error" && { bgcolor: "#FEE2E2", color: "#991B1B" }),
        }),
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: radius.sm,
          fontSize: "0.75rem",
          fontWeight: 500,
          backdropFilter: "blur(8px)",
        },
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
