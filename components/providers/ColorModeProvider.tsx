"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { buildTheme, type ColorMode } from "@/styles/theme";

const STORAGE_KEY = "theme";

type ColorModeContextValue = {
  mode: ColorMode;
  toggleColorMode: () => void;
  setMode: (mode: ColorMode) => void;
};

const ColorModeContext = createContext<ColorModeContextValue | null>(null);

export function useColorMode(): ColorModeContextValue {
  const ctx = useContext(ColorModeContext);
  if (!ctx) throw new Error("useColorMode musí být použit uvnitř ColorModeProvider");
  return ctx;
}

export function ColorModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ColorMode>("light");

  useEffect(() => {
    // Načtení preference z localStorage po mountu brání hydration mismatch
    // (server nezná uložený motiv). Jde o synchronizaci externího stavu do Reactu.
    const stored = window.localStorage.getItem(STORAGE_KEY) as ColorMode | null;
    const next =
      stored === "light" || stored === "dark"
        ? stored
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMode(next);
  }, []);

  const value = useMemo<ColorModeContextValue>(
    () => ({
      mode,
      setMode: (next) => {
        setMode(next);
        window.localStorage.setItem(STORAGE_KEY, next);
      },
      toggleColorMode: () =>
        setMode((prev) => {
          const next = prev === "light" ? "dark" : "light";
          window.localStorage.setItem(STORAGE_KEY, next);
          return next;
        }),
    }),
    [mode],
  );

  const theme = useMemo(() => buildTheme(mode), [mode]);

  return (
    <ColorModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
