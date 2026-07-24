import { describe, expect, it } from "vitest";

import { EmailDeliveryError } from "@/modules/email/domain/email-provider";

describe("EmailProvider contract", () => {
  it("uses a sanitized public message for delivery errors", () => {
    const error = new EmailDeliveryError("TIMEOUT");

    expect(error.kind).toBe("TIMEOUT");
    expect(error.message).toBe("No fue posible entregar el correo.");
  });
});
