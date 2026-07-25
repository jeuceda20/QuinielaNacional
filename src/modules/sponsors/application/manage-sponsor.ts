import { z } from "zod";
export const sponsorSchema = z.object({
  name: z.string().trim().min(2).max(150),
  imagePath: z
    .string()
    .regex(/^\/[a-z0-9._/-]+$/i)
    .nullable()
    .optional(),
  targetUrl: z
    .string()
    .url()
    .refine((value) => value.startsWith("https://"))
    .nullable()
    .optional(),
  displayOrder: z.number().int().min(0).max(999),
  isActive: z.boolean().default(true),
});
export type SponsorInput = z.infer<typeof sponsorSchema>;
export interface SponsorRepository {
  create(input: SponsorInput): Promise<void>;
  listActive(now: Date): Promise<readonly SponsorInput[]>;
}
export class ManageSponsor {
  public constructor(private readonly repository: SponsorRepository) {}
  async create(actor: { role: string; status: string }, input: SponsorInput) {
    if (actor.status !== "APPROVED" || !["ADMIN", "SUPER_ADMIN"].includes(actor.role))
      throw new Error("FORBIDDEN");
    await this.repository.create(sponsorSchema.parse(input));
  }
}
