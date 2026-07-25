import { describe, expect, it } from "vitest";

import { publicSettingsSchema } from "@/modules/settings/application/public-settings";
describe("publicSettingsSchema", () => {
  it("accepts public values and rejects secret-like fields", () => {
    expect(
      publicSettingsSchema.parse({
        name: "Quiniela",
        logoPath: "/logo.png",
        howItWorks: "Reglas",
        socialLinks: { red: "https://example.com" },
        registrationEnabled: true,
      }).registrationEnabled,
    ).toBe(true);
    expect(() =>
      publicSettingsSchema.parse({
        name: "Quiniela",
        logoPath: null,
        howItWorks: "",
        socialLinks: {},
        registrationEnabled: true,
        secret: "x",
      }),
    ).toThrow();
  });
});
