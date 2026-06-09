"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import { PageHeader } from "@/components/ui/PageHeader";
import { SpaceStepper } from "@/components/ui/SpaceStepper";
import { Step1Duration } from "./Step1Duration";
import { Step2DaySelect } from "./Step2DaySelect";
import { Step3WeekEditor } from "./Step3WeekEditor";
import { Step4DayEditor } from "./Step4DayEditor";
import { Step5ReviewTable } from "./Step5ReviewTable";
import { Step6FinalStep } from "./Step6FinalStep";
import { WeekTabs } from "./WeekTabs";
import { WizardStepFrame, wizardNavSx } from "./WizardStepFrame";
import { kmToMinutes, minutesToHhmm, parseNum } from "@/lib/utils/plan";
import { range } from "@/lib/utils/cycle";
import { radius } from "@/styles/tokens";
import {
  createEmptyWizardState,
  type WizardActivity,
  type WizardState,
  type WizardWeek,
} from "@/types/training-plan";

const STEPS = ["Délka", "Dny", "Cíle týdnů", "Plán dnů", "Náhled", "Dokončení"];

function buildStructures(state: WizardState): Pick<WizardState, "weeks" | "activities"> {
  const weeks: WizardWeek[] = range(1, state.numberOfCycles).map(
    (cycle) =>
      state.weeks.find((w) => w.autonumCycle === cycle) ?? {
        autonumCycle: cycle,
        expectedKm: "",
        expectedTime: "",
        description: "",
      },
  );

  const activities: WizardActivity[] = [];
  for (const cycle of range(1, state.numberOfCycles)) {
    for (const day of state.trainingDays) {
      const existing = state.activities.find(
        (a) => a.autonumCycle === cycle && a.autonumInCycle === day,
      );
      activities.push(
        existing ?? {
          autonumCycle: cycle,
          autonumInCycle: day,
          activityId: null,
          groupId: null,
          activityTrainingId: null,
          name: "",
          description: "",
          km: "",
          time: "",
        },
      );
    }
  }

  return { weeks, activities };
}

export function PlanWizard() {
  const [step, setStep] = useState(0);
  const [activeWeek, setActiveWeek] = useState(1);
  const [state, setState] = useState<WizardState>(createEmptyWizardState);
  const [error, setError] = useState<string | null>(null);

  const update = (patch: Partial<WizardState>) => setState((s) => ({ ...s, ...patch }));

  const updateWeek = (cycle: number, patch: Partial<WizardWeek>) =>
    setState((s) => ({
      ...s,
      weeks: s.weeks.map((w) => (w.autonumCycle === cycle ? { ...w, ...patch } : w)),
    }));

  const updateActivity = (cycle: number, day: number, patch: Partial<WizardActivity>) =>
    setState((s) => ({
      ...s,
      activities: s.activities.map((a) =>
        a.autonumCycle === cycle && a.autonumInCycle === day ? { ...a, ...patch } : a,
      ),
    }));

  const addDay = (cycle: number) =>
    setState((s) => {
      const used = s.activities.filter((a) => a.autonumCycle === cycle).map((a) => a.autonumInCycle);
      const free = range(1, 7).find((d) => !used.includes(d));
      if (!free) return s;
      const next: WizardActivity = {
        autonumCycle: cycle,
        autonumInCycle: free,
        activityId: null,
        groupId: null,
        activityTrainingId: null,
        name: "",
        description: "",
        km: "",
        time: "",
      };
      return { ...s, activities: [...s.activities, next] };
    });

  const removeDay = (cycle: number, day: number) =>
    setState((s) => ({
      ...s,
      activities: s.activities.filter(
        (a) => !(a.autonumCycle === cycle && a.autonumInCycle === day),
      ),
    }));

  const removeActivityRow = (cycle: number, day: number) => removeDay(cycle, day);

  const handleNext = () => {
    setError(null);
    if (step === 0) {
      if (!state.name.trim()) return setError("Zadej název plánu.");
      if (state.numberOfCycles < 1) return setError("Počet týdnů musí být alespoň 1.");
    }
    if (step === 1) {
      if (state.trainingDays.length === 0) return setError("Vyber alespoň jeden tréninkový den.");
      setState((s) => ({ ...s, ...buildStructures(s) }));
      setActiveWeek(1);
    }
    if (step === 2) {
      const incomplete = state.weeks.some((w) => !w.expectedKm.trim());
      if (incomplete) return setError("Vyplň očekávané km u všech týdnů.");
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  };

  // Auto-výpočet času z km × tempo (krok 3)
  const setWeekKm = (cycle: number, km: string) =>
    updateWeek(cycle, {
      expectedKm: km,
      expectedTime: minutesToHhmm(kmToMinutes(parseNum(km), state.paceMinutes)),
    });

  // Auto-výpočet času dne z km × tempo (krok 4)
  const setDayKm = (cycle: number, day: number, km: string) =>
    updateActivity(cycle, day, {
      km,
      time: minutesToHhmm(kmToMinutes(parseNum(km), state.paceMinutes)),
    });

  const showWeekTabs = step === 2 || step === 3;
  const stepWidth = step === 3 ? "wide" : step === 4 ? "full" : "narrow";
  const navWidth = stepWidth;

  return (
    <>
      <PageHeader title="Tréninkový plán" subtitle="Průvodce vytvořením tréninkového plánu" />

      <SpaceStepper steps={STEPS} activeStep={step} />

      <Card
        sx={{
          maxWidth: 1400,
          mx: "auto",
          borderRadius: radius.lg,
        }}
      >
        <CardContent sx={{ p: { xs: 3, md: 4 }, minHeight: 360 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {showWeekTabs && (
            <WizardStepFrame width={stepWidth}>
              <WeekTabs
                count={state.numberOfCycles}
                value={activeWeek}
                onChange={setActiveWeek}
                title={step === 2 ? "Cíle jednotlivých týdnů" : "Detailní plán tréninkových dnů"}
              />
            </WizardStepFrame>
          )}

          <Box sx={{ mb: 3 }}>
            <WizardStepFrame width={stepWidth}>
              {step === 0 && <Step1Duration state={state} update={update} />}
              {step === 1 && <Step2DaySelect state={state} update={update} />}
              {step === 2 && (
                <Step3WeekEditor
                  state={state}
                  activeWeek={activeWeek}
                  updateWeek={updateWeek}
                  setWeekKm={setWeekKm}
                />
              )}
              {step === 3 && (
                <Step4DayEditor
                  state={state}
                  activeWeek={activeWeek}
                  updateActivity={updateActivity}
                  setDayKm={setDayKm}
                  addDay={addDay}
                  removeDay={removeDay}
                />
              )}
              {step === 4 && <Step5ReviewTable state={state} removeDay={removeActivityRow} />}
              {step === 5 && <Step6FinalStep state={state} />}
            </WizardStepFrame>
          </Box>

          {step < STEPS.length - 1 && (
            <Stack direction="row" spacing={2} sx={{ justifyContent: "space-between", ...wizardNavSx(navWidth) }}>
              <Button onClick={handleBack} disabled={step === 0}>
                Zpět
              </Button>
              <Button variant="contained" onClick={handleNext}>
                Další
              </Button>
            </Stack>
          )}
          {step === STEPS.length - 1 && (
            <Stack direction="row" sx={wizardNavSx("narrow")}>
              <Button onClick={handleBack}>Zpět</Button>
            </Stack>
          )}
        </CardContent>
      </Card>
    </>
  );
}
