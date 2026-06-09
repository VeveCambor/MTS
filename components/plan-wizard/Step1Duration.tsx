"use client";

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import type { WizardState } from "@/types/training-plan";

type Props = {
  state: WizardState;
  update: (patch: Partial<WizardState>) => void;
};

const headingSx = { textAlign: "center", fontSize: { xs: "1.15rem", md: "1.35rem" } };

export function Step1Duration({ state, update }: Props) {
  return (
    <Stack spacing={2.5} sx={{ width: "100%" }}>
      <Typography variant="h3" sx={headingSx}>
        Zadejte název a délku tréninkového plánu
      </Typography>

      <TextField
        label="Název plánu"
        value={state.name}
        onChange={(e) => update({ name: e.target.value })}
        autoFocus
        fullWidth
      />

      <TextField
        label="Popis"
        value={state.description}
        onChange={(e) => update({ description: e.target.value })}
        multiline
        minRows={2}
        fullWidth
      />

      <TextField
        type="number"
        label="Počet týdnů"
        value={state.numberOfCycles}
        onChange={(e) => update({ numberOfCycles: Math.max(1, Number(e.target.value)) })}
        slotProps={{ htmlInput: { min: 1, max: 52 } }}
        fullWidth
      />

      <Typography variant="subtitle2" sx={{ pt: 1, textAlign: "center" }}>
        Nastavení tempa (min/km)
      </Typography>
      <TextField
        type="number"
        label="Minuty na kilometr"
        value={state.paceMinutes}
        onChange={(e) => update({ paceMinutes: Math.max(1, Number(e.target.value)) })}
        slotProps={{ htmlInput: { min: 1, max: 30 } }}
        sx={{ maxWidth: 240, mx: "auto", width: "100%" }}
      />
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
        Výchozí tempo: {state.paceMinutes} min/km. Čas se automaticky vypočítá v minutách na základě
        kilometrů a zvoleného tempa.
      </Typography>
    </Stack>
  );
}
