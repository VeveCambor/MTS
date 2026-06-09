"use client";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

type WeekTabsProps = {
  count: number;
  value: number;
  onChange: (week: number) => void;
  title?: string;
};

export function WeekTabs({ count, value, onChange, title }: WeekTabsProps) {
  return (
    <Box sx={{ mb: 3 }}>
      {title && (
        <Typography variant="h3" sx={{ fontSize: "1.15rem", mb: 1.5, textAlign: "center" }}>
          {title}
        </Typography>
      )}
      <Tabs
        value={value}
        onChange={(_, v) => onChange(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          "& .MuiTab-root.Mui-selected": {
            fontWeight: 700,
          },
        }}
      >
        {Array.from({ length: count }, (_, i) => i + 1).map((week) => (
          <Tab key={week} value={week} label={`Týden ${week}`} />
        ))}
      </Tabs>
    </Box>
  );
}
