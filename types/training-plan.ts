import type {
  TrainingPlan,
  TrainingPlanWeek,
  TrainingPlanActivityAssign,
  TrainingPlanUserAssign,
  TrainingPlanUserAssignWeek,
  TrainingPlanUserAssignActivity,
} from "./domain";

export type CompleteTrainingPlan = TrainingPlan & {
  weeks: TrainingPlanWeek[];
  activities: TrainingPlanActivityAssign[];
};

export type CompleteAssignedPlan = TrainingPlanUserAssign & {
  weeks: TrainingPlanUserAssignWeek[];
  activities: TrainingPlanUserAssignActivity[];
};

// ---- Stav wizardu ----

export type WizardActivity = {
  autonumCycle: number; // pořadí cyklu (1..N)
  autonumInCycle: number; // den v cyklu (1..cycleLength)
  activityTrainingId: string | null;
  name: string;
  description: string;
};

export type WizardWeek = {
  autonumCycle: number;
  expectedKm: string;
  expectedTime: string; // hh:mm
  description: string;
};

export type WizardState = {
  name: string;
  description: string;
  cycleLength: number;
  numberOfCycles: number;
  trainingDays: number[]; // dny v cyklu, které jsou tréninkové (1..cycleLength)
  weeks: WizardWeek[];
  activities: WizardActivity[];
};

export const createEmptyWizardState = (): WizardState => ({
  name: "",
  description: "",
  cycleLength: 7,
  numberOfCycles: 1,
  trainingDays: [],
  weeks: [],
  activities: [],
});
