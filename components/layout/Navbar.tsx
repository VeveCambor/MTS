"use client";

import { useState } from "react";
import Link from "next/link";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { useColorMode } from "@/components/providers/ColorModeProvider";
import { useProfile } from "@/hooks/useProfile";
import { useAuthActions } from "@/hooks/useAuthActions";
import { roleLabel } from "@/lib/constants/roles";

type NavbarProps = {
  onMenuClick: () => void;
};

export function Navbar({ onMenuClick }: NavbarProps) {
  const { mode, toggleColorMode } = useColorMode();
  const { profile } = useProfile();
  const { signOut } = useAuthActions();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const displayName = profile?.first_name || profile?.nick || "Profil";
  const initial = (profile?.first_name?.[0] ?? profile?.nick?.[0] ?? "?").toUpperCase();

  return (
    <AppBar position="fixed" color="default" elevation={0} sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Toolbar>
        <IconButton edge="start" onClick={onMenuClick} sx={{ mr: 1, display: { md: "none" } }}>
          <MenuIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton onClick={toggleColorMode} aria-label="Přepnout motiv">
          {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} aria-label="Účet" sx={{ ml: 1 }}>
          <Avatar sx={{ width: 34, height: 34, bgcolor: "primary.main" }}>{initial}</Avatar>
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle2">{displayName}</Typography>
            <Typography variant="caption" color="text.secondary">
              {roleLabel(profile?.role)}
            </Typography>
          </Box>
          <Divider />
          <MenuItem component={Link} href="/profile" onClick={() => setAnchorEl(null)}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            Profil
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              void signOut();
            }}
          >
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Odhlásit se
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
