"use client";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { SpaceCard } from "@/components/ui/SpaceCard";
import { dayLabel } from "@/lib/utils/cycle";
import type { WizardState } from "@/types/training-plan";

export function StepReview({ state }: { state: WizardState }) {
  const assignedCount = state.activities.filter((a) => a.activityTrainingId || a.name.trim()).length;

  return (
    <Stack spacing={2}>
      <SpaceCard title={state.name || "Bez názvu"}>
        <Stack spacing={1}>
          {state.description && (
            <Typography variant="body2" color="text.secondary">
              {state.description}
            </Typography>
          )}
          <Typography variant="body2">
            Délka cyklu: <strong>{state.cycleLength} dní</strong> · Počet cyklů:{" "}
            <strong>{state.numberOfCycles}</strong>
          </Typography>
          <Typography variant="body2">
            Přiřazených tréninků: <strong>{assignedCount}</strong>
          </Typography>
        </Stack>
      </SpaceCard>

      <SpaceCard title="Tréninkové dny">
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
          {state.trainingDays.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Nevybrány žádné dny.
            </Typography>
          ) : (
            state.trainingDays.map((d) => (
              <Chip key={d} label={dayLabel(d, state.cycleLength)} size="small" />
            ))
          )}
        </Stack>
      </SpaceCard>
    </Stack>
  );
}
