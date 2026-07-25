import { describe, expect, it } from "vitest";

import { getAllowedServerActionOrigins } from "@/lib/security/server-action-origins";

describe("getAllowedServerActionOrigins", () => {
  it("uses the host of the configured public application URL", () => {
    expect(getAllowedServerActionOrigins("https://quiniela.example.com/app")).toEqual([
      "quiniela.example.com",
    ]);
  });

  it("keeps a development port when it is part of the origin", () => {
    expect(getAllowedServerActionOrigins("http://localhost:3000")).toEqual(["localhost:3000"]);
  });

  it("does not allow an absent or invalid URL", () => {
    expect(getAllowedServerActionOrigins(undefined)).toEqual([]);
    expect(getAllowedServerActionOrigins("not a url")).toEqual([]);
    expect(getAllowedServerActionOrigins("ftp://quiniela.example.com")).toEqual([]);
  });
});
