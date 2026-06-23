import { z } from "zod";

export const accountTypeSchema = z.enum(["trainer", "trainee"], {
  message: "Vyber typ účtu",
});

export type AccountType = z.infer<typeof accountTypeSchema>;

export const loginSchema = z.object({
  email: z.string().min(1, "Zadej e-mail").email("Neplatný e-mail"),
  password: z.string().min(1, "Zadej heslo"),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    nick: z.string().min(2, "Přezdívka musí mít alespoň 2 znaky"),
    email: z.string().min(1, "Zadej e-mail").email("Neplatný e-mail"),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    accountType: accountTypeSchema,
    password: z.string().min(8, "Heslo musí mít alespoň 8 znaků"),
    passwordConfirm: z.string(),
  })
  .refine((v) => v.password === v.passwordConfirm, {
    message: "Hesla se neshodují",
    path: ["passwordConfirm"],
  });

export type RegisterValues = z.infer<typeof registerSchema>;
