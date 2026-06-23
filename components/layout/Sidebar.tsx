"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Popover from "@mui/material/Popover";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useColorMode } from "@/components/providers/ColorModeProvider";
import { getNavSections, type NavItem, type NavSection } from "@/lib/constants/navigation";
import { useProfile } from "@/hooks/useProfile";
import { futuristicGlassSx, shellShimmerSx, layout, navIconButtonSx, radius, shellTokens, glassPanelSx } from "@/styles/tokens";

type SidebarProps = {
  onNavigate?: () => void;
  variant?: "rail" | "drawer";
};

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function isSectionActive(pathname: string, items: NavItem[]): boolean {
  return items.some((item) => isActive(pathname, item.href));
}

function NavIconButton({
  item,
  active,
  onClick,
}: {
  item: NavItem;
  active: boolean;
  onClick?: () => void;
}) {
  const { mode } = useColorMode();

  return (
    <Tooltip title={item.label} placement="right" arrow>
      <span>
        <IconButton
          component={Link}
          href={item.href}
          onClick={onClick}
          aria-label={item.label}
          sx={navIconButtonSx(mode, active)}
        >
          {item.icon}
        </IconButton>
      </span>
    </Tooltip>
  );
}

function TemplateGroupRail({
  section,
  pathname,
  onNavigate,
}: {
  section: NavSection;
  pathname: string;
  onNavigate?: () => void;
}) {
  const { mode } = useColorMode();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const active = isSectionActive(pathname, section.items);

  return (
    <>
      <Tooltip title={section.label ?? "Šablony"} placement="right" arrow>
        <IconButton
          onClick={(e) => setAnchor(e.currentTarget)}
          aria-label={section.label ?? "Šablony"}
          sx={navIconButtonSx(mode, active || Boolean(anchor))}
        >
          {section.icon ?? section.items[0]?.icon}
        </IconButton>
      </Tooltip>
      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: "center", horizontal: "right" }}
        transformOrigin={{ vertical: "center", horizontal: "left" }}
        slotProps={{ paper: { sx: { ml: 1, minWidth: 240 } } }}
      >
        <List dense disablePadding sx={{ py: 1 }}>
          {section.items.map((item) => (
            <ListItemButton
              key={item.href}
              component={Link}
              href={item.href}
              selected={isActive(pathname, item.href)}
              onClick={() => {
                setAnchor(null);
                onNavigate?.();
              }}
              sx={{ mx: 1, borderRadius: radius.md }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Popover>
    </>
  );
}

function TemplateGroupDrawer({
  section,
  pathname,
  onNavigate,
}: {
  section: NavSection;
  pathname: string;
  onNavigate?: () => void;
}) {
  const active = isSectionActive(pathname, section.items);
  const [open, setOpen] = useState(active);

  return (
    <>
      <ListItemButton onClick={() => setOpen((v) => !v)} sx={{ mx: 1, borderRadius: radius.md }}>
        <ListItemIcon sx={{ minWidth: 40 }}>{section.icon}</ListItemIcon>
        <ListItemText primary={section.label} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto">
        <List disablePadding dense>
          {section.items.map((item) => (
            <ListItemButton
              key={item.href}
              component={Link}
              href={item.href}
              selected={isActive(pathname, item.href)}
              onClick={onNavigate}
              sx={{ pl: 6, mx: 1, borderRadius: radius.md }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    </>
  );
}

function DrawerNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { role } = useProfile();
  const sections = getNavSections(role);

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h3" sx={{ px: 3, pb: 2, fontSize: "1.1rem", color: "primary.main" }}>
        MyTrainingSpace
      </Typography>
      {sections.map((section, idx) =>
        section.label ? (
          <TemplateGroupDrawer
            key={section.label}
            section={section}
            pathname={pathname}
            onNavigate={onNavigate}
          />
        ) : (
          <List key={idx} disablePadding>
            {section.items.map((item) => (
              <ListItemButton
                key={item.href}
                component={Link}
                href={item.href}
                selected={isActive(pathname, item.href)}
                onClick={onNavigate}
                sx={{ mx: 1, borderRadius: radius.md, mb: 0.5 }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        ),
      )}
    </Box>
  );
}

function RailNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { role } = useProfile();
  const sections = getNavSections(role);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, py: 2.5, px: 1 }}>
      {sections.map((section, idx) => {
        if (section.label) {
          return (
            <TemplateGroupRail
              key={section.label}
              section={section}
              pathname={pathname}
              onNavigate={onNavigate}
            />
          );
        }
        return section.items.map((item) => (
          <NavIconButton
            key={item.href}
            item={item}
            active={isActive(pathname, item.href)}
            onClick={onNavigate}
          />
        ));
      })}
    </Box>
  );
}

export function Sidebar({ onNavigate, variant = "rail" }: SidebarProps) {
  const { mode } = useColorMode();
  const tokens = shellTokens(mode);

  if (variant === "drawer") {
    return <DrawerNav onNavigate={onNavigate} />;
  }

  return (
    <Box
      component="nav"
      aria-label="Hlavní navigace"
      sx={{
        position: "fixed",
        top: layout.topOffset,
        left: layout.sidebarLeft,
        width: layout.sidebarWidth,
        borderRadius: tokens.shellRadius,
        bgcolor: tokens.sidebarBg,
        ...futuristicGlassSx(mode),
        ...shellShimmerSx(mode),
        zIndex: (t) => t.zIndex.drawer,
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
        alignItems: "center",
        maxHeight: `calc(100vh - ${layout.topOffset + 24}px)`,
        overflowY: "auto",
      }}
    >
      <RailNav onNavigate={onNavigate} />
    </Box>
  );
}

export function BottomNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { role } = useProfile();
  const sections = getNavSections(role);
  const { mode } = useColorMode();
  const tokens = shellTokens(mode);
  const flatItems = sections.flatMap((s) => s.items).slice(0, 5);

  return (
    <Box
      component="nav"
      sx={{
        display: { xs: "flex", md: "none" },
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: layout.bottomBarHeight,
        bgcolor: tokens.sidebarBg,
        ...glassPanelSx(mode),
        borderTop: `1px solid ${tokens.glassBorderOuter}`,
        zIndex: (t) => t.zIndex.appBar,
        justifyContent: "space-around",
        alignItems: "center",
        px: 1,
      }}
    >
      {flatItems.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <IconButton
            key={item.href}
            component={Link}
            href={item.href}
            onClick={onNavigate}
            aria-label={item.label}
            sx={navIconButtonSx(mode, active)}
          >
            {item.icon}
          </IconButton>
        );
      })}
    </Box>
  );
}
