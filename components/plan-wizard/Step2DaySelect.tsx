"use client";

import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { dayLabel } from "@/lib/utils/cycle";
import type { WizardState } from "@/types/training-plan";

type Props = {
  state: WizardState;
  update: (patch: Partial<WizardState>) => void;
};

const headingSx = { textAlign: "center", fontSize: { xs: "1.15rem", md: "1.35rem" } };

export function Step2DaySelect({ state, update }: Props) {
  const toggle = (day: number) => {
    const next = state.trainingDays.includes(day)
      ? state.trainingDays.filter((d) => d !== day)
      : [...state.trainingDays, day].sort((a, b) => a - b);
    update({ trainingDays: next });
  };

  return (
    <Stack spacing={3} sx={{ width: "100%" }}>
      <Typography variant="h3" sx={headingSx}>
        Vyberte dny v týdnu pro tréninky
      </Typography>

      <TextField
        type="date"
        label="Datum začátku tréninkového plánu"
        value={state.dateTimeStart}
        onChange={(e) => update({ dateTimeStart: e.target.value })}
        helperText="Datum prvního dne tréninkového plánu"
        slotProps={{ inputLabel: { shrink: true } }}
        sx={{ maxWidth: 320, mx: "auto", width: "100%" }}
      />

      <FormGroup sx={{ px: { xs: 0, sm: 2 } }}>
        <Grid container spacing={1} sx={{ justifyContent: "center" }}>
          {Array.from({ length: 7 }, (_, i) => i + 1).map((day) => (
            <Grid key={day} size={{ xs: 6, sm: 4 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={state.trainingDays.includes(day)}
                    onChange={() => toggle(day)}
                  />
                }
                label={dayLabel(day, 7)}
              />
            </Grid>
          ))}
        </Grid>
      </FormGroup>
    </Stack>
  );
}
