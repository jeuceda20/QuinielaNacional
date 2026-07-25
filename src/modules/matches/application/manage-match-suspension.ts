import { z } from "zod";
export const suspendMatchSchema = z.object({
  matchId: z.string().uuid(),
  reason: z.string().trim().min(3).max(500),
});
export type SuspensionActor = Readonly<{
  id: string;
  role: "USER" | "ADMIN" | "SUPER_ADMIN";
  status: string;
}>;
export interface MatchSuspensionRepository {
  change(
    matchId: string,
    status: "SUSPENDED" | "RESUMED",
    actorId: string,
    reason: string | null,
    now: Date,
  ): Promise<"CHANGED" | "NOT_FOUND" | "INVALID_STATE">;
}
export class ManageMatchSuspension {
  public constructor(private readonly matches: MatchSuspensionRepository) {}
  private auth(a: SuspensionActor) {
    if (a.status !== "APPROVED" || (a.role !== "ADMIN" && a.role !== "SUPER_ADMIN"))
      throw new Error("FORBIDDEN");
  }
  async suspend(a: SuspensionActor, i: z.infer<typeof suspendMatchSchema>, n: Date) {
    this.auth(a);
    const r = await this.matches.change(i.matchId, "SUSPENDED", a.id, i.reason, n);
    if (r !== "CHANGED") throw new Error(r);
  }
  async resume(a: SuspensionActor, id: string, n: Date) {
    this.auth(a);
    const r = await this.matches.change(id, "RESUMED", a.id, null, n);
    if (r !== "CHANGED") throw new Error(r);
  }
}
