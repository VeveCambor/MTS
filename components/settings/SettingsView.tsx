"use client";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LogoutIcon from "@mui/icons-material/Logout";
import { PageHeader } from "@/components/ui/PageHeader";
import { SpaceCard } from "@/components/ui/SpaceCard";
import { useColorMode } from "@/components/providers/ColorModeProvider";
import { useAuthActions } from "@/hooks/useAuthActions";

export function SettingsView() {
  const { mode, setMode } = useColorMode();
  const { signOut } = useAuthActions();

  return (
    <>
      <PageHeader title="Nastavení" />

      <Stack spacing={2} sx={{ maxWidth: 560 }}>
        <SpaceCard title="Vzhled">
          <Stack spacing={1.5}>
            <Typography variant="body2" color="text.secondary">
              Barevný motiv aplikace
            </Typography>
            <ToggleButtonGroup
              exclusive
              value={mode}
              onChange={(_, value) => value && setMode(value)}
              size="small"
            >
              <ToggleButton value="light">
                <LightModeIcon sx={{ mr: 1 }} fontSize="small" /> Světlý
              </ToggleButton>
              <ToggleButton value="dark">
                <DarkModeIcon sx={{ mr: 1 }} fontSize="small" /> Tmavý
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </SpaceCard>

        <SpaceCard title="Účet">
          <Button
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={() => void signOut()}
          >
            Odhlásit se
          </Button>
        </SpaceCard>
      </Stack>
    </>
  );
}
