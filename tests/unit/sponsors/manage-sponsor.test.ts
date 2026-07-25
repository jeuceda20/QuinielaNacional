import { describe, expect, it, vi } from "vitest";

import { ManageSponsor, sponsorSchema } from "@/modules/sponsors/application/manage-sponsor";
describe("ManageSponsor", () => {
  it("requires admin and accepts secure links", async () => {
    const repository = { create: vi.fn(), listActive: vi.fn() },
      input = sponsorSchema.parse({
        name: "Patrocinador",
        targetUrl: "https://example.com",
        imagePath: "/sponsors/a.png",
        displayOrder: 1,
      });
    await new ManageSponsor(repository).create({ role: "ADMIN", status: "APPROVED" }, input);
    expect(repository.create).toHaveBeenCalledOnce();
    expect(() => sponsorSchema.parse({ ...input, targetUrl: "http://unsafe.test" })).toThrow();
  });
});
