"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useColorMode } from "@/components/providers/ColorModeProvider";
import { motion, neonGlow, shellTokens } from "@/styles/tokens";

type SpaceStepperProps = {
  steps: string[];
  activeStep: number;
};

export function SpaceStepper({ steps, activeStep }: SpaceStepperProps) {
  const { mode } = useColorMode();
  const tokens = shellTokens(mode);
  const progress = steps.length > 1 ? (activeStep / (steps.length - 1)) * 100 : 0;

  return (
    <Box sx={{ mb: 4, px: { xs: 0, md: 2 } }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 16,
            left: "8%",
            right: "8%",
            height: 2,
            borderRadius: "999px",
            bgcolor: mode === "light" ? "rgba(226, 232, 240, 0.9)" : "rgba(51, 65, 85, 0.8)",
            overflow: "hidden",
            zIndex: 0,
          }}
        >
          <Box
            sx={{
              height: "100%",
              width: `${progress}%`,
              bgcolor: tokens.accent,
              borderRadius: "999px",
              transition: `width ${motion.slow}`,
              boxShadow: neonGlow(mode, "soft"),
            }}
          />
        </Box>

        {steps.map((label, index) => {
          const done = index < activeStep;
          const active = index === activeStep;
          return (
            <Box
              key={label}
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                zIndex: 1,
                minWidth: 0,
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "0.8125rem",
                  transition: `all ${motion.normal}`,
                  ...(active
                    ? {
                        bgcolor: tokens.accent,
                        color: mode === "light" ? "#fff" : "#1B1B3A",
                        boxShadow: neonGlow(mode, "medium"),
                        transform: "scale(1.06)",
                        animation: "step-pulse 2.5s ease-in-out infinite",
                      }
                    : done
                      ? {
                          bgcolor: mode === "light" ? "#5B21B6" : "#99FFEC",
                          color: mode === "light" ? "#fff" : "#1B1B3A",
                        }
                      : {
                          bgcolor: tokens.glassActive,
                          backdropFilter: "blur(8px)",
                          color: "text.secondary",
                          border: `1px solid ${tokens.glassBorderOuter}`,
                        }),
                }}
              >
                {done ? "✓" : index + 1}
              </Box>
              <Typography
                variant="caption"
                sx={{
                  mt: 1,
                  fontWeight: active ? 700 : 500,
                  color: active ? "text.primary" : "text.secondary",
                  textAlign: "center",
                  fontSize: { xs: "0.65rem", sm: "0.75rem" },
                  lineHeight: 1.2,
                  px: 0.5,
                  letterSpacing: active ? "0.02em" : "0",
                  transition: `color ${motion.fast}`,
                }}
              >
                {label}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
