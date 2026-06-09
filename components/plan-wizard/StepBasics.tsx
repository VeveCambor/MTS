"use client";

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import type { WizardState } from "@/types/training-plan";

type StepBasicsProps = {
  state: WizardState;
  update: (patch: Partial<WizardState>) => void;
};

export function StepBasics({ state, update }: StepBasicsProps) {
  return (
    <Stack spacing={2.5} sx={{ maxWidth: 480 }}>
      <TextField
        label="Název plánu"
        value={state.name}
        onChange={(e) => update({ name: e.target.value })}
        autoFocus
      />
      <TextField
        label="Popis"
        value={state.description}
        onChange={(e) => update({ description: e.target.value })}
        multiline
        minRows={2}
      />
      <TextField
        select
        label="Délka cyklu"
        value={state.cycleLength}
        onChange={(e) => update({ cycleLength: Number(e.target.value) })}
        helperText="Počet dní v jednom cyklu (týden = 7)"
      >
        {[7, 10, 14].map((n) => (
          <MenuItem key={n} value={n}>
            {n} dní
          </MenuItem>
        ))}
      </TextField>
      <TextField
        type="number"
        label="Počet cyklů"
        value={state.numberOfCycles}
        onChange={(e) => update({ numberOfCycles: Math.max(1, Number(e.target.value)) })}
        slotProps={{ htmlInput: { min: 1, max: 52 } }}
      />
    </Stack>
  );
}
