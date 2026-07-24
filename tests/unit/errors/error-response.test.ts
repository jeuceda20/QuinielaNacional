import { describe, expect, it } from "vitest";

import { ApplicationError } from "@/lib/errors/application-error";
import { ErrorCode } from "@/lib/errors/error-code";
import { serializeError } from "@/lib/errors/error-response";

describe("serializeError", () => {
  it("serializes an application error using the public API contract", () => {
    const serializedError = serializeError(
      new ApplicationError({
        code: ErrorCode.VALIDATION_ERROR,
        message: "Revisa los datos enviados.",
        fieldErrors: { nickname: ["Debe tener al menos 3 caracteres."] },
        details: { query: "SELECT * FROM users" },
      }),
      "req_test_123",
    );

    expect(serializedError).toEqual({
      response: {
        success: false,
        error: {
          code: ErrorCode.VALIDATION_ERROR,
          message: "Revisa los datos enviados.",
          fieldErrors: { nickname: ["Debe tener al menos 3 caracteres."] },
        },
        requestId: "req_test_123",
      },
      statusCode: 422,
    });
  });

  it("sanitizes unexpected errors before returning them to the client", () => {
    const serializedError = serializeError(
      new Error("password=secret; SELECT * FROM users"),
      "req_test_456",
    );

    expect(serializedError).toEqual({
      response: {
        success: false,
        error: {
          code: ErrorCode.INTERNAL_ERROR,
          message: "Ocurrió un error inesperado. Inténtalo de nuevo.",
        },
        requestId: "req_test_456",
      },
      statusCode: 500,
    });
    expect(JSON.stringify(serializedError)).not.toContain("password=secret");
    expect(JSON.stringify(serializedError)).not.toContain("stack");
  });
});
