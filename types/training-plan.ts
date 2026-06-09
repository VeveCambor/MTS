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
  autonumCycle: number; // pořadí týdne (1..N)
  autonumInCycle: number; // den v týdnu (1..7, Po=1)
  activityId: string | null; // sport (jen pro kaskádu v editoru)
  groupId: string | null; // skupina (jen pro kaskádu v editoru)
  activityTrainingId: string | null; // tréninková jednotka
  name: string;
  description: string;
  km: string; // očekávané km dne (nepersistuje se, slouží pro statistiky)
  time: string; // hh:mm (auto z km × tempo)
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
  cycleLength: number; // délka cyklu ve dnech (týden = 7)
  numberOfCycles: number; // počet týdnů
  paceMinutes: number; // tempo min/km pro auto-výpočet času
  dateTimeStart: string; // ISO datum prvního dne (yyyy-MM-dd)
  trainingDays: number[]; // dny v týdnu (1=Po..7=Ne)
  weeks: WizardWeek[];
  activities: WizardActivity[];
};

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export const createEmptyWizardState = (): WizardState => ({
  name: "",
  description: "",
  cycleLength: 7,
  numberOfCycles: 1,
  paceMinutes: 5,
  dateTimeStart: todayIso(),
  trainingDays: [],
  weeks: [],
  activities: [],
});
