import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { EnvironmentValidationError, validateEnvironment } from "@/lib/env/environment";

const validEnvironment: NodeJS.ProcessEnv = {
  NODE_ENV: "test",
  DATABASE_URL: "postgresql://user:password@localhost:5432/quiniela_test",
  DIRECT_DATABASE_URL: "postgresql://user:password@localhost:5432/quiniela_test",
  APP_URL: "http://localhost:3000",
  APP_TIMEZONE: "America/Tegucigalpa",
  SESSION_SECRET: "test-session-secret",
  INITIAL_SETUP_TOKEN: "test-initial-setup-token",
  SMTP_HOST: "localhost",
  SMTP_PORT: "1025",
  SMTP_USER: "test",
  SMTP_APP_PASSWORD: "test-password",
};

describe("validateEnvironment", () => {
  it("parses typed values and disables omitted feature flags", () => {
    const environment = validateEnvironment(validEnvironment);

    assert.equal(environment.SMTP_PORT, 1025);
    assert.equal(environment.ENABLE_DIAGNOSTICS, false);
    assert.equal(environment.ENABLE_SQL_CONSOLE, false);
  });

  it("reports invalid variable names without exposing their values", () => {
    const secretValue = "sensitive-session-secret";
    const invalidEnvironment: NodeJS.ProcessEnv = {
      ...validEnvironment,
      SESSION_SECRET: secretValue,
    };
    delete invalidEnvironment.SMTP_HOST;

    assert.throws(
      () => validateEnvironment(invalidEnvironment),
      (error: unknown) => {
        assert.ok(error instanceof EnvironmentValidationError);
        assert.deepEqual(error.variableNames, ["SMTP_HOST"]);
        assert.doesNotMatch(error.message, new RegExp(secretValue));

        return true;
      },
    );
  });
});
