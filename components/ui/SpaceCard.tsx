"use client";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import type { SxProps, Theme } from "@mui/material/styles";
import { useColorMode } from "@/components/providers/ColorModeProvider";
import { glassShimmerSx, motion, neonGlow, shellTokens } from "@/styles/tokens";

type SpaceCardProps = {
  title?: React.ReactNode;
  subheader?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
  contentSx?: SxProps<Theme>;
  glass?: boolean;
  hover?: boolean;
};

export function SpaceCard({
  title,
  subheader,
  action,
  children,
  sx,
  contentSx,
  glass = false,
  hover = true,
}: SpaceCardProps) {
  const { mode } = useColorMode();
  const tokens = shellTokens(mode);

  return (
    <Card
      sx={{
        position: "relative",
        overflow: "hidden",
        ...(glass && {
          background: tokens.glassCard,
          backdropFilter: "blur(16px) saturate(150%)",
          borderColor: tokens.glassBorderOuter,
          ...glassShimmerSx(mode),
        }),
        ...(hover && {
          transition: `transform ${motion.normal}, box-shadow ${motion.normal}`,
          "&:hover": {
            transform: tokens.hoverLift,
            boxShadow: glass ? neonGlow(mode, "soft") : undefined,
          },
        }),
        ...sx,
      }}
    >
      {(title || action) && (
        <CardHeader
          title={title}
          subheader={subheader}
          action={action}
          slotProps={{
            title: {
              variant: "h3",
              sx: { fontSize: "1.125rem", fontWeight: 600, letterSpacing: "-0.01em" },
            },
          }}
        />
      )}
      <CardContent sx={{ p: 3, ...contentSx }}>{children}</CardContent>
    </Card>
  );
}
