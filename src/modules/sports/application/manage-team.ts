import { z } from "zod";

export const teamInputSchema = z.object({
  name: z.string().trim().min(2).max(120),
  shortName: z.string().trim().min(2).max(30),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  logoPath: z
    .string()
    .trim()
    .regex(/^\/(?:[a-z0-9._/-]+\.(?:png|jpe?g|webp))$/i)
    .nullable()
    .optional(),
  displayOrder: z.number().int().min(0).max(999),
});
export type TeamActor = Readonly<{
  id: string;
  role: "USER" | "ADMIN" | "SUPER_ADMIN";
  status: string;
}>;
export interface TeamManagementRepository {
  create(
    input: z.infer<typeof teamInputSchema> & { actorId: string; now: Date },
  ): Promise<"CREATED" | "DUPLICATE">;
  update(
    id: string,
    input: z.infer<typeof teamInputSchema> & { actorId: string; now: Date },
  ): Promise<boolean>;
  setActive(id: string, isActive: boolean, actorId: string, now: Date): Promise<boolean>;
  softDelete(id: string, actorId: string, now: Date): Promise<boolean>;
}
export class ManageTeam {
  public constructor(private readonly repository: TeamManagementRepository) {}
  private authorize(actor: TeamActor) {
    if (actor.status !== "APPROVED" || (actor.role !== "ADMIN" && actor.role !== "SUPER_ADMIN"))
      throw new Error("FORBIDDEN");
  }
  async create(actor: TeamActor, input: z.infer<typeof teamInputSchema>, now: Date) {
    this.authorize(actor);
    const r = await this.repository.create({ ...input, actorId: actor.id, now });
    if (r === "DUPLICATE") throw new Error("DUPLICATE_TEAM");
  }
  async update(actor: TeamActor, id: string, input: z.infer<typeof teamInputSchema>, now: Date) {
    this.authorize(actor);
    if (!(await this.repository.update(id, { ...input, actorId: actor.id, now })))
      throw new Error("TEAM_NOT_FOUND");
  }
  async setActive(actor: TeamActor, id: string, isActive: boolean, now: Date) {
    this.authorize(actor);
    if (!(await this.repository.setActive(id, isActive, actor.id, now)))
      throw new Error("TEAM_NOT_FOUND");
  }
}
