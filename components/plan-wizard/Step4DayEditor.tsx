"use client";

import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { DayAccordion } from "./DayAccordion";
import { useProfile } from "@/hooks/useProfile";
import { hhmmToMinutes, minutesToHhmm, parseNum, weekTotals } from "@/lib/utils/plan";
import type { WizardActivity, WizardState } from "@/types/training-plan";

type Props = {
  state: WizardState;
  activeWeek: number;
  updateActivity: (cycle: number, day: number, patch: Partial<WizardActivity>) => void;
  setDayKm: (cycle: number, day: number, km: string) => void;
  addDay: (cycle: number) => void;
  removeDay: (cycle: number, day: number) => void;
};

export function Step4DayEditor({
  state,
  activeWeek,
  updateActivity,
  setDayKm,
  addDay,
  removeDay,
}: Props) {
  const { profile } = useProfile();

  const days = state.activities
    .filter((a) => a.autonumCycle === activeWeek)
    .sort((a, b) => a.autonumInCycle - b.autonumInCycle);

  const week = state.weeks.find((w) => w.autonumCycle === activeWeek);
  const totals = weekTotals(days);
  const goalKm = parseNum(week?.expectedKm ?? "");
  const goalMin = hhmmToMinutes(week?.expectedTime ?? "");
  const remKm = goalKm - totals.km;
  const remMin = goalMin - totals.minutes;

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          p: 2,
          borderRadius: 2,
          bgcolor: "action.hover",
        }}
      >
        <Typography variant="body2">
          Celkem km: <strong>{totals.km}</strong>
        </Typography>
        <Typography variant="body2">
          Celkem čas: <strong>{minutesToHhmm(totals.minutes)}</strong>
        </Typography>
        <Typography variant="body2" sx={{ color: remKm < 0 ? "error.main" : "text.primary" }}>
          Zbývá km: <strong>{remKm}</strong>
        </Typography>
        <Typography variant="body2" sx={{ color: remMin < 0 ? "error.main" : "text.primary" }}>
          Zbývá čas: <strong>{minutesToHhmm(Math.abs(remMin))}{remMin < 0 ? " navíc" : ""}</strong>
        </Typography>
      </Box>

      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="subtitle1">Dny v týdnu {activeWeek}</Typography>
        <Button
          size="small"
          startIcon={<AddIcon />}
          onClick={() => addDay(activeWeek)}
          disabled={days.length >= 7}
        >
          Přidat den
        </Button>
      </Stack>

      {days.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Žádné dny – přidej den tlačítkem výše.
        </Typography>
      ) : (
        days.map((activity) => (
          <DayAccordion
            key={`${activity.autonumCycle}-${activity.autonumInCycle}`}
            state={state}
            trainerId={profile?.id}
            activity={activity}
            updateActivity={updateActivity}
            setDayKm={setDayKm}
            removeDay={removeDay}
          />
        ))
      )}
    </Stack>
  );
}
