export function getTestDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL_TEST;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL_TEST is required for integration tests.");
  }

  const databaseName = new URL(databaseUrl).pathname.slice(1);

  if (!databaseName.endsWith("_test")) {
    throw new Error("DATABASE_URL_TEST must target a database ending in _test.");
  }

  return databaseUrl;
}
