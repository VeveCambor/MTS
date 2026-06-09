"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import type { NavSection } from "@/lib/constants/navigation";

type SidebarProps = {
  sections: NavSection[];
  onNavigate?: () => void;
};

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar({ sections, onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Toolbar>
        <Typography variant="h3" sx={{ color: "primary.main", fontWeight: 700 }}>
          MyTrainingSpace
        </Typography>
      </Toolbar>
      <Box sx={{ overflowY: "auto", flexGrow: 1 }}>
        {sections.map((section, idx) => (
          <List
            key={section.label ?? idx}
            subheader={
              section.label ? (
                <ListSubheader disableSticky sx={{ bgcolor: "transparent" }}>
                  {section.label}
                </ListSubheader>
              ) : undefined
            }
          >
            {section.items.map((item) => (
              <ListItemButton
                key={item.href}
                component={Link}
                href={item.href}
                selected={isActive(pathname, item.href)}
                onClick={onNavigate}
                sx={{ mx: 1, borderRadius: 1 }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        ))}
      </Box>
    </Box>
  );
}
