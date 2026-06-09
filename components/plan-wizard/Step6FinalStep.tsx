"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SaveIcon from "@mui/icons-material/Save";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useProfile } from "@/hooks/useProfile";
import { useTrainees } from "@/hooks/useTrainees";
import { useTrainingPlans } from "@/hooks/useTrainingPlans";
import { useAssignedPlans } from "@/hooks/useAssignedPlans";
import type { WizardState } from "@/types/training-plan";

type Props = {
  state: WizardState;
};

function buildDescription(state: WizardState): string {
  if (state.description.trim()) return state.description.trim();
  const notes = state.weeks.map((w) => w.description.trim()).filter(Boolean);
  return notes.join(" | ");
}

export function Step6FinalStep({ state }: Props) {
  const router = useRouter();
  const { profile } = useProfile();
  const { data: trainees } = useTrainees(profile?.id);

  const [asTemplate, setAsTemplate] = useState(true);
  const [assign, setAssign] = useState(false);
  const [traineeId, setTraineeId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const { save } = useTrainingPlans(profile?.id);
  const { assignFromTemplate } = useAssignedPlans(traineeId || undefined);

  const finalState: WizardState = { ...state, description: buildDescription(state) };

  const runSave = async (opts: { template: boolean; assign: boolean }) => {
    setError(null);
    if (!profile?.id) return;
    if (!opts.template && !opts.assign) {
      setError("Vyber alespoň jednu možnost.");
      return;
    }
    if (opts.assign && !traineeId) {
      setError("Pro přiřazení vyber cvičence.");
      return;
    }
    setBusy(true);
    try {
      const templateId = await save.mutateAsync(finalState);
      if (opts.assign && traineeId) {
        await assignFromTemplate.mutateAsync({
          templateId,
          startDate: new Date(state.dateTimeStart).toISOString(),
        });
      }
      router.push(opts.assign && !opts.template ? "/trainees" : "/templates/training-plan");
    } catch {
      setError("Uložení se nepodařilo.");
      setBusy(false);
    }
  };

  return (
    <Stack spacing={2.5} sx={{ width: "100%" }}>
      <Typography variant="h3" sx={{ textAlign: "center", fontSize: { xs: "1.15rem", md: "1.35rem" } }}>
        Dokončení tréninkového plánu
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <Stack spacing={1} sx={{ alignItems: "center" }}>
        <FormControlLabel
          control={<Checkbox checked={asTemplate} onChange={(e) => setAsTemplate(e.target.checked)} />}
          label="Uložit jako šablonu"
        />
        <FormControlLabel
          control={<Checkbox checked={assign} onChange={(e) => setAssign(e.target.checked)} />}
          label="Přiřadit cvičenci"
        />
      </Stack>

      {assign && (
        <TextField
          select
          label="Cvičenec"
          value={traineeId}
          onChange={(e) => setTraineeId(e.target.value)}
          sx={{ maxWidth: 320, mx: "auto", width: "100%" }}
        >
          {(trainees ?? []).map((t) => (
            <MenuItem key={t.id} value={t.id}>
              {[t.first_name, t.last_name].filter(Boolean).join(" ") || t.nick || t.id}
            </MenuItem>
          ))}
        </TextField>
      )}

      <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
        Při přiřazení cvičenci se plán vždy uloží i jako šablona (slouží jako zdroj kopie).
      </Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ pt: 1, justifyContent: "center" }}>
        <Button
          variant="outlined"
          startIcon={<SaveIcon />}
          onClick={() => runSave({ template: true, assign: false })}
          disabled={busy}
        >
          Uložit jako šablonu
        </Button>
        <Button
          variant="contained"
          onClick={() => runSave({ template: asTemplate, assign })}
          disabled={busy}
        >
          {busy ? "Ukládám…" : "Dokončit plán"}
        </Button>
      </Stack>
    </Stack>
  );
}
