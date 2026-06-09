export const Role = {
  Unverified: 0,
  User: 1,
  SubscriptionUser: 2,
  Trainer: 20,
  SubscriptionTrainer: 21,
  Admin: 1000,
} as const;

export type RoleValue = (typeof Role)[keyof typeof Role];

export const TRAINER_ROLES: number[] = [Role.Trainer, Role.SubscriptionTrainer];
export const TRAINEE_ROLES: number[] = [Role.User, Role.SubscriptionUser];

export const isTrainer = (role: number | null | undefined): boolean =>
  role != null && (TRAINER_ROLES.includes(role) || role === Role.Admin);

export const isTrainee = (role: number | null | undefined): boolean =>
  role != null && TRAINEE_ROLES.includes(role);

export const isAdmin = (role: number | null | undefined): boolean => role === Role.Admin;

export const roleLabel = (role: number | null | undefined): string => {
  switch (role) {
    case Role.Unverified:
      return "Neověřený";
    case Role.User:
      return "Cvičenec";
    case Role.SubscriptionUser:
      return "Cvičenec (předplatné)";
    case Role.Trainer:
      return "Trenér";
    case Role.SubscriptionTrainer:
      return "Trenér (předplatné)";
    case Role.Admin:
      return "Administrátor";
    default:
      return "Neznámá role";
  }
};
