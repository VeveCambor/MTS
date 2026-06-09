import type { Tables } from "./database";

export type Profile = Tables<"profiles">;
export type Activity = Tables<"activities">;
export type ActivityGroup = Tables<"activity_groups">;
export type ActivityTraining = Tables<"activity_trainings">;
export type ParamUnit = Tables<"activity_training_param_units">;
export type ParameterType = Tables<"parameter_types">;
export type TrainerParameter = Tables<"trainer_parameters">;
export type ActivityTrainingParamAssign = Tables<"activity_training_parameters_assign">;
export type ActualUserParameter = Tables<"actual_user_parameters">;
export type TrainingPlan = Tables<"training_plans">;
export type TrainingPlanWeek = Tables<"training_plan_week_definitions">;
export type TrainingPlanActivityAssign = Tables<"training_plan_activity_training_assigns">;
export type TrainingPlanUserAssign = Tables<"training_plan_user_assigns">;
export type TrainingPlanUserAssignWeek = Tables<"training_plan_user_assign_week_definitions">;
export type TrainingPlanUserAssignActivity =
  Tables<"training_plan_user_assign_activity_training_assigns">;
export type TrainingDiaryNote = Tables<"training_diary_notes">;

export type UserShort = Pick<Profile, "id" | "nick" | "first_name" | "last_name" | "role">;
