"use client";

import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { dayLabel, range } from "@/lib/utils/cycle";
import type { WizardState } from "@/types/training-plan";

type StepDaysProps = {
  state: WizardState;
  update: (patch: Partial<WizardState>) => void;
};

export function StepDays({ state, update }: StepDaysProps) {
  const days = range(1, state.cycleLength);

  const toggle = (day: number) => {
    const next = state.trainingDays.includes(day)
      ? state.trainingDays.filter((d) => d !== day)
      : [...state.trainingDays, day].sort((a, b) => a - b);
    update({ trainingDays: next });
  };

  return (
    <Stack spacing={2}>
      <Typography variant="body2" color="text.secondary">
        Vyber dny v cyklu, kdy se trénuje.
      </Typography>
      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
        {days.map((day) => (
          <Chip
            key={day}
            label={dayLabel(day, state.cycleLength)}
            color={state.trainingDays.includes(day) ? "primary" : "default"}
            variant={state.trainingDays.includes(day) ? "filled" : "outlined"}
            onClick={() => toggle(day)}
          />
        ))}
      </Stack>
    </Stack>
  );
}
