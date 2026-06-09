"use client";

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import type { WizardState, WizardWeek } from "@/types/training-plan";

type Props = {
  state: WizardState;
  activeWeek: number;
  updateWeek: (cycle: number, patch: Partial<WizardWeek>) => void;
  setWeekKm: (cycle: number, km: string) => void;
};

export function Step3WeekEditor({ state, activeWeek, updateWeek, setWeekKm }: Props) {
  const week = state.weeks.find((w) => w.autonumCycle === activeWeek);
  if (!week) return null;

  return (
    <Stack spacing={2.5} sx={{ width: "100%" }}>
      <Typography variant="subtitle1" sx={{ textAlign: "center", fontWeight: 600 }}>
        Týden {week.autonumCycle}
      </Typography>

      <TextField
        label="Poznámka k týdnu"
        value={week.description}
        onChange={(e) => updateWeek(week.autonumCycle, { description: e.target.value })}
        multiline
        minRows={2}
        fullWidth
      />

      <TextField
        label="Odhad km v týdnu"
        value={week.expectedKm}
        onChange={(e) => setWeekKm(week.autonumCycle, e.target.value)}
        sx={{ maxWidth: 240, mx: "auto", width: "100%" }}
      />

      <TextField
        label="Odhadovaný čas v týdnu (h:mm)"
        value={week.expectedTime}
        onChange={(e) => updateWeek(week.autonumCycle, { expectedTime: e.target.value })}
        placeholder="1:40"
        helperText="Automaticky z km × tempo, lze přepsat"
        sx={{ maxWidth: 280, mx: "auto", width: "100%" }}
      />
    </Stack>
  );
}
