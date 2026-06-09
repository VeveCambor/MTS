export const queryKeys = {
  profile: ["profile"] as const,
  trainees: (trainerId: string) => ["trainees", trainerId] as const,
  activities: ["activities"] as const,
  myActivities: (userId: string) => ["my-activities", userId] as const,
  groups: (activityId: string) => ["activity-groups", activityId] as const,
  trainings: (groupId: string) => ["activity-trainings", groupId] as const,
  units: ["param-units"] as const,
  parameterTypes: ["parameter-types"] as const,
  parameters: (userId: string) => ["trainer-parameters", userId] as const,
  parametersForActivity: (userId: string, activityId: string) =>
    ["trainer-parameters", userId, activityId] as const,
  actualParams: (userId: string) => ["actual-params", userId] as const,
  plans: (trainerId: string) => ["training-plans", trainerId] as const,
  planComplete: (planId: string) => ["training-plan-complete", planId] as const,
  assignedPlans: (userId: string) => ["assigned-plans", userId] as const,
  assignedPlanComplete: (assignId: string) => ["assigned-plan-complete", assignId] as const,
  diaryNotes: (userId: string) => ["diary-notes", userId] as const,
};
