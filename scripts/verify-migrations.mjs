import { config } from "dotenv";
import { execFileSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { Client } from "pg";

config({ path: ".env.local", quiet: true });

const directDatabaseUrl = process.env.DIRECT_DATABASE_URL;

if (!directDatabaseUrl) {
  throw new Error("DIRECT_DATABASE_URL is required to verify migrations.");
}

const temporaryDatabaseName = `quiniela_migration_check_${randomBytes(6).toString("hex")}`;
const migrationDatabaseUrl = new URL(directDatabaseUrl);
const adminDatabaseUrl = new URL(directDatabaseUrl);

migrationDatabaseUrl.pathname = `/${temporaryDatabaseName}`;
adminDatabaseUrl.pathname = "/postgres";

const adminClient = new Client({ connectionString: adminDatabaseUrl.toString() });
let isConnected = false;
let isDatabaseCreated = false;

try {
  await adminClient.connect();
  isConnected = true;
  await adminClient.query(`CREATE DATABASE "${temporaryDatabaseName}"`);
  isDatabaseCreated = true;

  execFileSync(process.execPath, ["./node_modules/prisma/build/index.js", "migrate", "deploy"], {
    env: {
      ...process.env,
      DIRECT_DATABASE_URL: migrationDatabaseUrl.toString(),
    },
    stdio: "inherit",
  });
} finally {
  if (isConnected) {
    if (isDatabaseCreated) {
      await adminClient.query(
        "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = $1 AND pid <> pg_backend_pid()",
        [temporaryDatabaseName],
      );
      await adminClient.query(`DROP DATABASE IF EXISTS "${temporaryDatabaseName}"`);
    }

    await adminClient.end();
  }
}
