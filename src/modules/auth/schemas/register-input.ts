import { z } from "zod";

export const registerInputSchema = z
  .object({
    firstName: z.string().trim().min(1).max(100),
    lastName: z.string().trim().min(1).max(100),
    nickname: z
      .string()
      .trim()
      .min(3)
      .max(50)
      .regex(/^[\p{L}\p{N}_-]+$/u),
    email: z.string().trim().email().max(254),
    password: z.string().min(12).max(128),
    passwordConfirmation: z.string(),
    favoriteTeamId: z.string().uuid(),
    acceptedRules: z.literal(true),
  })
  .refine((value) => value.password === value.passwordConfirmation, {
    message: "Las contraseñas no coinciden.",
    path: ["passwordConfirmation"],
  });

export type RegisterInput = z.infer<typeof registerInputSchema>;
