"use client";

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { SpaceCard } from "@/components/ui/SpaceCard";
import type { WizardState, WizardWeek } from "@/types/training-plan";

type StepWeeksProps = {
  state: WizardState;
  updateWeek: (index: number, patch: Partial<WizardWeek>) => void;
};

export function StepWeeks({ state, updateWeek }: StepWeeksProps) {
  return (
    <Stack spacing={2}>
      <Typography variant="body2" color="text.secondary">
        Zadej očekávané objemy pro jednotlivé cykly.
      </Typography>
      {state.weeks.map((week, index) => (
        <SpaceCard key={week.autonumCycle} title={`Cyklus ${week.autonumCycle}`}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Očekávané km"
              value={week.expectedKm}
              onChange={(e) => updateWeek(index, { expectedKm: e.target.value })}
              sx={{ maxWidth: 160 }}
            />
            <TextField
              label="Očekávaný čas (hh:mm)"
              value={week.expectedTime}
              onChange={(e) => updateWeek(index, { expectedTime: e.target.value })}
              placeholder="01:30"
              sx={{ maxWidth: 200 }}
            />
            <TextField
              label="Popis"
              value={week.description}
              onChange={(e) => updateWeek(index, { description: e.target.value })}
              fullWidth
            />
          </Stack>
        </SpaceCard>
      ))}
    </Stack>
  );
}
