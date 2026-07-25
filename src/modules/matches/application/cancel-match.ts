import { z } from "zod";
export const cancelMatchSchema = z.object({
  matchId: z.string().uuid(),
  reason: z.string().trim().min(3).max(500),
});
export type CancelActor = Readonly<{
  id: string;
  role: "USER" | "ADMIN" | "SUPER_ADMIN";
  status: string;
}>;
export interface MatchCancellationRepository {
  cancel(
    input: z.infer<typeof cancelMatchSchema> & { actorId: string; now: Date },
  ): Promise<"CANCELLED" | "NOT_FOUND" | "INVALID_STATE">;
}
export class CancelMatch {
  public constructor(private readonly matches: MatchCancellationRepository) {}
  async execute(a: CancelActor, i: z.infer<typeof cancelMatchSchema>, n: Date) {
    if (a.status !== "APPROVED" || (a.role !== "ADMIN" && a.role !== "SUPER_ADMIN"))
      throw new Error("FORBIDDEN");
    const r = await this.matches.cancel({ ...i, actorId: a.id, now: n });
    if (r !== "CANCELLED") throw new Error(r);
  }
}
