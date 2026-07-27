import { describe, expect, it } from "vitest";

import { EnvironmentValidationError, validateEnvironment } from "@/lib/env/environment";

const validEnvironment: NodeJS.ProcessEnv = {
  NODE_ENV: "test",
  DATABASE_URL: "postgresql://user:password@localhost:5432/quiniela_test",
  DIRECT_DATABASE_URL: "postgresql://user:password@localhost:5432/quiniela_test",
  APP_URL: "http://localhost:3000",
  APP_TIMEZONE: "America/Tegucigalpa",
  SESSION_SECRET: "test-session-secret",
  INITIAL_SETUP_TOKEN: "test-initial-setup-token",
};

describe("validateEnvironment", () => {
  it("parses typed values and disables omitted feature flags", () => {
    const environment = validateEnvironment(validEnvironment);

    expect(environment.ENABLE_DIAGNOSTICS).toBe(false);
    expect(environment.ENABLE_SQL_CONSOLE).toBe(false);
  });

  it("reports invalid variable names without exposing their values", () => {
    const secretValue = "sensitive-session-secret";
    const invalidEnvironment: NodeJS.ProcessEnv = {
      ...validEnvironment,
      SESSION_SECRET: secretValue,
    };
    delete invalidEnvironment.SESSION_SECRET;

    expect(() => validateEnvironment(invalidEnvironment)).toThrow(EnvironmentValidationError);

    try {
      validateEnvironment(invalidEnvironment);
    } catch (error) {
      expect(error).toBeInstanceOf(EnvironmentValidationError);
      expect((error as EnvironmentValidationError).variableNames).toEqual(["SESSION_SECRET"]);
      expect((error as Error).message).not.toContain(secretValue);
    }
  });
});
