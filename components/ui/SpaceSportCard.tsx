"use client";

import Link from "next/link";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { getSportStyle } from "@/lib/constants/sports";
import { motion } from "@/styles/tokens";

type SpaceSportCardProps = {
  name: string;
  description?: string | null;
  href: string;
};

const SIZE = 200;

export function SpaceSportCard({ name, href }: SpaceSportCardProps) {
  const { color, Icon, label } = getSportStyle(name);

  return (
    <Box
      sx={{
        position: "relative",
        width: SIZE,
        height: SIZE,
        mx: "auto",
        "&:hover .sport-orbit": { opacity: 1 },
        "&:hover .sport-orbit-inner": { opacity: 0.7 },
      }}
    >
      {/* Orbitální kroužky */}
      <Box
        className="sport-orbit"
        sx={{
          position: "absolute",
          inset: -8,
          borderRadius: "50%",
          border: `1px dashed ${color}44`,
          opacity: 0,
          animation: "orbit-spin 14s linear infinite",
          transition: `opacity ${motion.normal}`,
          pointerEvents: "none",
        }}
      />
      <Box
        className="sport-orbit-inner"
        sx={{
          position: "absolute",
          inset: -3,
          borderRadius: "50%",
          border: `1px solid ${color}33`,
          opacity: 0,
          animation: "orbit-spin 8s linear infinite reverse",
          transition: `opacity ${motion.normal}`,
          pointerEvents: "none",
        }}
      />

      <Card
        sx={{
          width: SIZE,
          height: SIZE,
          borderRadius: "50%",
          overflow: "hidden",
          backdropFilter: "blur(8px)",
          transition: `transform ${motion.normal}, box-shadow ${motion.normal}`,
          "&:hover": {
            transform: "translateY(-4px) scale(1.02)",
            boxShadow: `0 8px 32px ${color}30, 0 0 0 1px ${color}22`,
            borderColor: color,
          },
        }}
      >
        <CardActionArea
          component={Link}
          href={href}
          sx={{
            width: SIZE,
            height: SIZE,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Stack spacing={1.25} sx={{ alignItems: "center", textAlign: "center", px: 2 }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: `${color}22`,
                color,
                boxShadow: `0 0 20px ${color}18`,
              }}
            >
              <Icon size={28} />
            </Box>
            <Typography
              variant="h3"
              sx={{
                fontSize: "0.95rem",
                fontWeight: 700,
                lineHeight: 1.2,
                maxWidth: 140,
                letterSpacing: "-0.01em",
              }}
            >
              {label}
            </Typography>
          </Stack>
        </CardActionArea>
      </Card>
    </Box>
  );
}
