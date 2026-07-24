import { describe, expect, it } from "vitest";

import { createRequestContext } from "@/lib/request-context";

describe("request context", () => {
  it("creates an anonymous context with a generated request id", () => {
    const context = createRequestContext();

    expect(context).toMatchObject({
      userId: null,
      role: null,
      ipAddress: null,
      userAgent: null,
    });
    expect(context.requestId).toMatch(/^req_/);
    expect(Object.isFrozen(context)).toBe(true);
  });

  it("retains only the allowed request metadata", () => {
    expect(
      createRequestContext({
        requestId: "req_test_123",
        userId: "user-id",
        role: "ADMIN",
        ipAddress: "127.0.0.1",
        userAgent: "test-agent",
      }),
    ).toEqual({
      requestId: "req_test_123",
      userId: "user-id",
      role: "ADMIN",
      ipAddress: "127.0.0.1",
      userAgent: "test-agent",
    });
  });
});
