import { z } from "zod";
export const createMatchSchema = z
  .object({
    roundId: z.string().uuid(),
    homeTeamId: z.string().uuid(),
    awayTeamId: z.string().uuid(),
    scheduledAt: z.coerce.date(),
    venue: z.string().trim().max(200).nullable().optional(),
    notes: z.string().trim().max(2000).nullable().optional(),
  })
  .refine((v) => v.homeTeamId !== v.awayTeamId, {
    path: ["awayTeamId"],
    message: "Los equipos deben ser distintos.",
  });
export type MatchActor = Readonly<{
  id: string;
  role: "USER" | "ADMIN" | "SUPER_ADMIN";
  status: string;
}>;
export interface MatchCreationRepository {
  create(
    input: z.infer<typeof createMatchSchema> & {
      actorId: string;
      predictionClosesAt: Date;
      now: Date;
    },
  ): Promise<"CREATED" | "INVALID_ROUND" | "INVALID_TEAM" | "DUPLICATE">;
}
export class CreateMatch {
  public constructor(private readonly matches: MatchCreationRepository) {}
  async execute(a: MatchActor, i: z.infer<typeof createMatchSchema>, n: Date) {
    if (a.status !== "APPROVED" || (a.role !== "ADMIN" && a.role !== "SUPER_ADMIN"))
      throw new Error("FORBIDDEN");
    const r = await this.matches.create({
      ...i,
      actorId: a.id,
      predictionClosesAt: new Date(i.scheduledAt.getTime() - 5 * 60_000),
      now: n,
    });
    if (r !== "CREATED") throw new Error(r);
  }
}
