import { Client } from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { getTestDatabaseUrl } from "../../helpers/test-database";

const client = new Client({ connectionString: getTestDatabaseUrl() });

describe("PostgreSQL integration database", () => {
  beforeAll(async () => {
    await client.connect();
  });

  afterAll(async () => {
    await client.end();
  });

  it("executes an isolated SELECT 1 query", async () => {
    const result = await client.query<{ connected: number }>("SELECT 1 AS connected;");

    expect(result.rows).toEqual([{ connected: 1 }]);
  });
});
