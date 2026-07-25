import { describe, expect, it, vi } from "vitest";

import { ManageTeam, teamInputSchema } from "@/modules/sports/application/manage-team";

const admin = { id: "admin-id", role: "ADMIN" as const, status: "APPROVED" };
const input = teamInputSchema.parse({
  name: "Equipo Norte",
  shortName: "Norte",
  slug: "equipo-norte",
  logoPath: "/teams/norte.png",
  displayOrder: 13,
});

describe("ManageTeam", () => {
  it("allows an approved administrator to create and manage a team", async () => {
    const repository = {
      create: vi.fn().mockResolvedValue("CREATED"),
      update: vi.fn().mockResolvedValue(true),
      setActive: vi.fn().mockResolvedValue(true),
      softDelete: vi.fn(),
    };
    const service = new ManageTeam(repository);
    await expect(service.create(admin, input, new Date())).resolves.toBeUndefined();
    await expect(service.setActive(admin, "team-id", false, new Date())).resolves.toBeUndefined();
  });
  it("rejects regular users, duplicate slugs, and unsafe logo paths", async () => {
    const repository = {
      create: vi.fn().mockResolvedValue("DUPLICATE"),
      update: vi.fn(),
      setActive: vi.fn(),
      softDelete: vi.fn(),
    };
    await expect(
      new ManageTeam(repository).create({ ...admin, role: "USER" }, input, new Date()),
    ).rejects.toThrow("FORBIDDEN");
    await expect(new ManageTeam(repository).create(admin, input, new Date())).rejects.toThrow(
      "DUPLICATE_TEAM",
    );
    expect(() => teamInputSchema.parse({ ...input, logoPath: "javascript:alert(1)" })).toThrow();
  });
});
