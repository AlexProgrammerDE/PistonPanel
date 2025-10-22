import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as authSchema from "~/db/auth-schema";
import * as schema from "~/db/schema";
import { getEnvVar } from "~/env";

const pool = new Pool({
  connectionString: getEnvVar("DATABASE_URL"),
});
export const db = drizzle({
  client: pool,
  schema: {
    ...authSchema,
    ...schema,
  },
});
