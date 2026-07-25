import { z } from "zod";
export const rescheduleMatchSchema = z.object({
  matchId: z.string().uuid(),
  scheduledAt: z.coerce.date(),
  reason: z.string().trim().min(3).max(500),
});
export type RescheduleActor = Readonly<{
  id: string;
  role: "USER" | "ADMIN" | "SUPER_ADMIN";
  status: string;
}>;
export interface MatchRescheduleRepository {
  reschedule(
    input: z.infer<typeof rescheduleMatchSchema> & {
      actorId: string;
      newClosesAt: Date;
      now: Date;
    },
  ): Promise<"RESCHEDULED" | "NOT_FOUND" | "INVALID_STATE">;
}
export class RescheduleMatch {
  public constructor(private readonly matches: MatchRescheduleRepository) {}
  async execute(a: RescheduleActor, i: z.infer<typeof rescheduleMatchSchema>, n: Date) {
    if (a.status !== "APPROVED" || (a.role !== "ADMIN" && a.role !== "SUPER_ADMIN"))
      throw new Error("FORBIDDEN");
    if (i.scheduledAt <= n) throw new Error("INVALID_SCHEDULE");
    const r = await this.matches.reschedule({
      ...i,
      actorId: a.id,
      newClosesAt: new Date(i.scheduledAt.getTime() - 300000),
      now: n,
    });
    if (r !== "RESCHEDULED") throw new Error(r);
  }
}
