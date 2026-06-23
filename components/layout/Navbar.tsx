"use client";

import { useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
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
import { avatarEmoji } from "@/lib/constants/avatars";
import { roleLabel } from "@/lib/constants/roles";
import { futuristicGlassSx, shellShimmerSx, layout, motion, shellTokens } from "@/styles/tokens";

type NavbarProps = {
  onMenuClick: () => void;
};

export function Navbar({ onMenuClick }: NavbarProps) {
  const { mode, toggleColorMode } = useColorMode();
  const tokens = shellTokens(mode);
  const { profile } = useProfile();
  const { signOut } = useAuthActions();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const displayName = profile?.first_name || profile?.nick || "Profil";
  const emoji = avatarEmoji(profile?.avatar ?? null);

  const iconBtnSx = {
    width: 40,
    height: 40,
    borderRadius: "50%",
    color: tokens.iconColor,
    bgcolor: tokens.glassHover,
    backdropFilter: "blur(8px)",
    border: `1px solid ${tokens.glassBorderOuter}`,
    transition: `all ${motion.normal}`,
    "&:hover": {
      color: tokens.iconHover,
      bgcolor: tokens.glassActive,
      transform: "scale(1.04)",
    },
  };

  return (
    <Box
      component="header"
      sx={{
        position: "fixed",
        top: layout.navbarTop,
        left: { xs: 12, md: layout.sidebarLeft },
        right: { xs: 12, md: 16 },
        height: layout.navbarHeight,
        zIndex: (t) => t.zIndex.appBar,
        borderRadius: tokens.shellRadius,
        bgcolor: tokens.navbarBg,
        ...futuristicGlassSx(mode),
        ...shellShimmerSx(mode),
        display: "flex",
        alignItems: "center",
        px: { xs: 2, md: 3 },
        gap: 1,
      }}
    >
      <IconButton
        onClick={onMenuClick}
        aria-label="Menu"
        sx={{ ...iconBtnSx, mr: 1, display: { md: "none" } }}
      >
        <MenuIcon />
      </IconButton>

      <Box
        component={Link}
        href="/dashboard"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          textDecoration: "none",
          color: "inherit",
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            bgcolor: tokens.glassActive,
            backdropFilter: "blur(8px)",
            border: `1px solid ${tokens.glassBorderOuter}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: "0.7rem",
            color: "primary.main",
          }}
        >
          MTS
        </Box>
        <Typography
          variant="h3"
          sx={{
            display: { xs: "none", sm: "block" },
            fontSize: "1.05rem",
            fontWeight: 700,
            color: "text.primary",
          }}
        >
          MyTrainingSpace
        </Typography>
      </Box>

      <Box sx={{ flexGrow: 1 }} />

      <IconButton onClick={toggleColorMode} aria-label="Přepnout motiv" sx={iconBtnSx}>
        {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>

      <IconButton
        onClick={(e) => setAnchorEl(e.currentTarget)}
        aria-label="Účet"
        sx={{ ...iconBtnSx, ml: 0.5, fontSize: "1.25rem" }}
      >
        {emoji}
      </IconButton>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <Box sx={{ px: 2, py: 1.5 }}>
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
    </Box>
  );
}
