import { spawn } from "node:child_process";

import { config } from "dotenv";

config({ path: ".env.local", quiet: true });

const testDatabaseUrl = process.env.DATABASE_URL_TEST;

if (!testDatabaseUrl || !new URL(testDatabaseUrl).pathname.endsWith("_test")) {
  throw new Error("DATABASE_URL_TEST must point to an isolated database ending in _test.");
}

const e2eEnvironment = {
  ...process.env,
  DATABASE_URL: testDatabaseUrl,
  DIRECT_DATABASE_URL: testDatabaseUrl,
  NODE_ENV: "test",
};

const server = spawn(
  process.execPath,
  ["./node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1"],
  { env: e2eEnvironment, stdio: "inherit" },
);

async function waitForServer() {
  const deadline = Date.now() + 30_000;

  while (Date.now() < deadline) {
    try {
      const response = await fetch("http://127.0.0.1:3000");

      if (response.ok) {
        return;
      }
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  throw new Error("The E2E server did not start within 30 seconds.");
}

function runPlaywright() {
  return new Promise((resolve) => {
    const playwright = spawn(
      process.execPath,
      ["./node_modules/playwright/cli.js", "test", ...process.argv.slice(2)],
      { env: e2eEnvironment, stdio: "inherit" },
    );

    playwright.on("exit", (code) => {
      resolve(code ?? 1);
    });
  });
}

try {
  await waitForServer();
  process.exitCode = await runPlaywright();
} finally {
  server.kill();
}
