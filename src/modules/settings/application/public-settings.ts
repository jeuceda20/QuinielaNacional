import { z } from "zod";
export const publicSettingsSchema = z
  .object({
    name: z.string().trim().min(2).max(150),
    logoPath: z
      .string()
      .regex(/^\/[a-z0-9._/-]+$/i)
      .nullable(),
    howItWorks: z.string().trim().max(5000),
    socialLinks: z.record(z.string(), z.string().url()),
    registrationEnabled: z.boolean(),
  })
  .strict();
export type PublicSettings = z.infer<typeof publicSettingsSchema>;
