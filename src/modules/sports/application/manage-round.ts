import { z } from "zod";
export const roundSchema = z.object({
  seasonId: z.string().uuid(),
  name: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  sequence: z.number().int().min(0).nullable().optional(),
  description: z.string().trim().max(500).nullable().optional(),
});
export type RoundActor = Readonly<{
  id: string;
  role: "USER" | "ADMIN" | "SUPER_ADMIN";
  status: string;
}>;
export interface RoundRepository {
  create(
    input: z.infer<typeof roundSchema> & { actorId: string; now: Date },
  ): Promise<"CREATED" | "INVALID_SEASON" | "DUPLICATE">;
  update(
    id: string,
    input: Partial<z.infer<typeof roundSchema>> & { actorId: string; now: Date },
  ): Promise<boolean>;
  setStatus(
    id: string,
    status: "PUBLISHED" | "ARCHIVED",
    actorId: string,
    now: Date,
  ): Promise<boolean>;
}
export class ManageRound {
  public constructor(private readonly rounds: RoundRepository) {}
  private auth(a: RoundActor) {
    if (a.status !== "APPROVED" || (a.role !== "ADMIN" && a.role !== "SUPER_ADMIN"))
      throw new Error("FORBIDDEN");
  }
  async create(a: RoundActor, i: z.infer<typeof roundSchema>, n: Date) {
    this.auth(a);
    const r = await this.rounds.create({ ...i, actorId: a.id, now: n });
    if (r !== "CREATED") throw new Error(r);
  }
  async publish(a: RoundActor, id: string, n: Date) {
    this.auth(a);
    if (!(await this.rounds.setStatus(id, "PUBLISHED", a.id, n))) throw new Error("INVALID_ROUND");
  }
  async archive(a: RoundActor, id: string, n: Date) {
    this.auth(a);
    if (!(await this.rounds.setStatus(id, "ARCHIVED", a.id, n))) throw new Error("INVALID_ROUND");
  }
}
