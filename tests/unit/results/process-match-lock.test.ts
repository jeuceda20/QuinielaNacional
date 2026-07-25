import { describe, expect, it } from "vitest";

import { isConcurrentLockError } from "@/modules/results/infrastructure/operational-lock";

import { Prisma } from "@/generated/prisma/client";

describe("match processing lock", () => {
  it("recognizes the unique lock conflict returned by PostgreSQL", () => {
    const error = new Prisma.PrismaClientKnownRequestError("duplicate", {
      clientVersion: "7.9.0",
      code: "P2002",
    });

    expect(isConcurrentLockError(error)).toBe(true);
    expect(isConcurrentLockError(new Error("other"))).toBe(false);
  });
});
