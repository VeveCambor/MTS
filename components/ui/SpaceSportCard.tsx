"use client";

import Link from "next/link";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { getSportStyle } from "@/lib/constants/sports";

type SpaceSportCardProps = {
  name: string;
  description?: string | null;
  href: string;
};

export function SpaceSportCard({ name, description, href }: SpaceSportCardProps) {
  const { color, Icon } = getSportStyle(name);

  return (
    <Card
      sx={{
        width: 200,
        height: 200,
        mx: "auto",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: `0 12px 28px ${color}40`,
          borderColor: color,
        },
      }}
    >
      <CardActionArea
        component={Link}
        href={href}
        sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Stack spacing={1.5} sx={{ alignItems: "center", textAlign: "center", px: 2 }}>
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: `${color}33`,
              color,
            }}
          >
            <Icon size={28} />
          </Box>
          <Typography variant="h3" sx={{ fontSize: "1.1rem" }}>
            {name}
          </Typography>
          {description && (
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.3 }}>
              {description}
            </Typography>
          )}
        </Stack>
      </CardActionArea>
    </Card>
  );
}
