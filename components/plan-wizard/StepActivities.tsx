"use client";

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { SpaceCard } from "@/components/ui/SpaceCard";
import { ActivityUnitPicker } from "./ActivityUnitPicker";
import { dayLabel } from "@/lib/utils/cycle";
import type { WizardActivity, WizardState } from "@/types/training-plan";

type StepActivitiesProps = {
  state: WizardState;
  updateActivity: (key: string, patch: Partial<WizardActivity>) => void;
};

const activityKey = (a: { autonumCycle: number; autonumInCycle: number }) =>
  `${a.autonumCycle}-${a.autonumInCycle}`;

export function StepActivities({ state, updateActivity }: StepActivitiesProps) {
  return (
    <Stack spacing={2}>
      <Typography variant="body2" color="text.secondary">
        Přiřaď tréninkovou jednotku k jednotlivým dnům. Pole můžeš nechat prázdné.
      </Typography>
      {Array.from({ length: state.numberOfCycles }, (_, i) => i + 1).map((cycle) => {
        const items = state.activities.filter((a) => a.autonumCycle === cycle);
        return (
          <SpaceCard key={cycle} title={`Cyklus ${cycle}`}>
            <Stack spacing={2} divider={<Divider flexItem />}>
              {items.map((item) => {
                const key = activityKey(item);
                return (
                  <Stack key={key} spacing={1.5}>
                    <Typography variant="subtitle2">
                      {dayLabel(item.autonumInCycle, state.cycleLength)}
                    </Typography>
                    <ActivityUnitPicker
                      value={item.activityTrainingId}
                      onChange={(id, name) =>
                        updateActivity(key, {
                          activityTrainingId: id,
                          name: item.name || name,
                        })
                      }
                    />
                    <TextField
                      size="small"
                      label="Poznámka k tréninku"
                      value={item.description}
                      onChange={(e) => updateActivity(key, { description: e.target.value })}
                      fullWidth
                    />
                  </Stack>
                );
              })}
            </Stack>
          </SpaceCard>
        );
      })}
    </Stack>
  );
}
