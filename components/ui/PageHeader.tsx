"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
};

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      sx={{
        mt: { xs: 0, md: 1 },
        mb: 4,
        alignItems: { sm: "center" },
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant="overline"
          sx={{
            display: "block",
            letterSpacing: "0.14em",
            fontWeight: 600,
            fontSize: "0.65rem",
            color: "text.secondary",
            mb: 0.5,
            opacity: 0.85,
          }}
        >
          MTS
        </Typography>
        <Typography
          variant="h2"
          color="text.primary"
          sx={{
            fontSize: { xs: "1.5rem", md: "1.875rem" },
            fontWeight: 700,
            lineHeight: 1.25,
            letterSpacing: "-0.025em",
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.75, letterSpacing: "0.01em" }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
      {action && <Box>{action}</Box>}
    </Stack>
  );
}
