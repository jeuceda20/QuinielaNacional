import { z } from "zod";

const booleanEnvironmentSchema = z
  .enum(["true", "false"])
  .optional()
  .transform((value) => value === "true");

const environmentSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]),
  DATABASE_URL: z.string().url(),
  DIRECT_DATABASE_URL: z.string().url(),
  APP_URL: z.string().url(),
  APP_TIMEZONE: z.literal("America/Tegucigalpa"),
  SESSION_SECRET: z.string().min(1),
  INITIAL_SETUP_TOKEN: z.string().min(1),
  ENABLE_DIAGNOSTICS: booleanEnvironmentSchema,
  ENABLE_SQL_CONSOLE: booleanEnvironmentSchema,
  ENABLE_SQL_WRITE: booleanEnvironmentSchema,
  ENABLE_TEST_DATA_TOOLS: booleanEnvironmentSchema,
});

export type Environment = z.infer<typeof environmentSchema>;

export class EnvironmentValidationError extends Error {
  readonly variableNames: readonly string[];

  constructor(variableNames: readonly string[]) {
    super(`Invalid environment variables: ${variableNames.join(", ")}`);
    this.name = "EnvironmentValidationError";
    this.variableNames = variableNames;
  }
}

export function validateEnvironment(environment: NodeJS.ProcessEnv): Environment {
  const result = environmentSchema.safeParse(environment);

  if (!result.success) {
    const variableNames = [...new Set(result.error.issues.map((issue) => String(issue.path[0])))];

    throw new EnvironmentValidationError(variableNames);
  }

  return result.data;
}
