import { z } from "zod";

export const createSeasonSchema = z
  .object({
    name: z.string().trim().min(3).max(100),
    slug: z
      .string()
      .trim()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    startsAt: z.coerce.date(),
    endsAt: z.coerce.date().nullable().optional(),
    exactPoints: z.literal(3).default(3),
    partialPoints: z.literal(1).default(1),
    wrongPoints: z.literal(0).default(0),
    doubleMultiplier: z.literal(2).default(2),
    predictionCloseMinutes: z.literal(5).default(5),
    maxPredictionGoals: z.number().int().min(1).max(20).default(20),
  })
  .refine((value) => !value.endsAt || value.endsAt > value.startsAt, {
    path: ["endsAt"],
    message: "La fecha final debe ser posterior a la inicial.",
  });
export type SeasonActor = Readonly<{
  id: string;
  role: "USER" | "ADMIN" | "SUPER_ADMIN";
  status: string;
}>;
export interface SeasonCreationRepository {
  createDraft(
    input: z.infer<typeof createSeasonSchema> & {
      actorId: string;
      requestId?: string | null;
      now: Date;
    },
  ): Promise<"CREATED" | "DUPLICATE">;
}
export class CreateSeason {
  public constructor(private readonly seasons: SeasonCreationRepository) {}
  async execute(
    actor: SeasonActor,
    input: z.infer<typeof createSeasonSchema>,
    now: Date,
    requestId?: string | null,
  ) {
    if (actor.status !== "APPROVED" || (actor.role !== "ADMIN" && actor.role !== "SUPER_ADMIN"))
      throw new Error("FORBIDDEN");
    const r = await this.seasons.createDraft({ ...input, actorId: actor.id, requestId, now });
    if (r === "DUPLICATE") throw new Error("DUPLICATE_SEASON");
  }
}
