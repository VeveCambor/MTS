"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Alert from "@mui/material/Alert";
import { PageHeader } from "@/components/ui/PageHeader";
import { StepBasics } from "./StepBasics";
import { StepDays } from "./StepDays";
import { StepWeeks } from "./StepWeeks";
import { StepActivities } from "./StepActivities";
import { StepReview } from "./StepReview";
import { useProfile } from "@/hooks/useProfile";
import { useTrainingPlans } from "@/hooks/useTrainingPlans";
import { range } from "@/lib/utils/cycle";
import {
  createEmptyWizardState,
  type WizardActivity,
  type WizardState,
  type WizardWeek,
} from "@/types/training-plan";

const STEPS = ["Základ", "Dny", "Týdny", "Aktivity", "Souhrn"];

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
          activityTrainingId: null,
          name: "",
          description: "",
        },
      );
    }
  }

  return { weeks, activities };
}

export function PlanWizard() {
  const router = useRouter();
  const { profile } = useProfile();
  const { save } = useTrainingPlans(profile?.id);
  const [step, setStep] = useState(0);
  const [state, setState] = useState<WizardState>(createEmptyWizardState);
  const [error, setError] = useState<string | null>(null);

  const update = (patch: Partial<WizardState>) => setState((s) => ({ ...s, ...patch }));

  const updateWeek = (index: number, patch: Partial<WizardWeek>) =>
    setState((s) => ({
      ...s,
      weeks: s.weeks.map((w, i) => (i === index ? { ...w, ...patch } : w)),
    }));

  const updateActivity = (key: string, patch: Partial<WizardActivity>) =>
    setState((s) => ({
      ...s,
      activities: s.activities.map((a) =>
        `${a.autonumCycle}-${a.autonumInCycle}` === key ? { ...a, ...patch } : a,
      ),
    }));

  const handleNext = () => {
    setError(null);
    if (step === 0 && !state.name.trim()) {
      setError("Zadej název plánu.");
      return;
    }
    if (step === 1) {
      setState((s) => ({ ...s, ...buildStructures(s) }));
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSave = () => {
    setError(null);
    if (!profile?.id) return;
    save.mutate(state, {
      onSuccess: () => router.push("/templates/training-plan"),
      onError: () => setError("Šablonu se nepodařilo uložit."),
    });
  };

  return (
    <>
      <PageHeader title="Nová šablona plánu" subtitle="Průvodce vytvořením tréninkového plánu" />

      <Stepper activeStep={step} sx={{ mb: 4 }}>
        {STEPS.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 4 }}>
        {step === 0 && <StepBasics state={state} update={update} />}
        {step === 1 && <StepDays state={state} update={update} />}
        {step === 2 && <StepWeeks state={state} updateWeek={updateWeek} />}
        {step === 3 && <StepActivities state={state} updateActivity={updateActivity} />}
        {step === 4 && <StepReview state={state} />}
      </Box>

      <Stack direction="row" spacing={2} sx={{ justifyContent: "space-between" }}>
        <Button onClick={handleBack} disabled={step === 0 || save.isPending}>
          Zpět
        </Button>
        {step < STEPS.length - 1 ? (
          <Button variant="contained" onClick={handleNext}>
            Pokračovat
          </Button>
        ) : (
          <Button variant="contained" onClick={handleSave} disabled={save.isPending}>
            {save.isPending ? "Ukládám…" : "Uložit jako šablonu"}
          </Button>
        )}
      </Stack>
    </>
  );
}
