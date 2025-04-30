import { drizzle } from 'drizzle-orm/node-postgres';
import * as authSchema from '~/db/auth-schema';
import * as schema from '~/db/schema';
import { Pool } from 'pg';
import 'dotenv-flow/config';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});
export const db = drizzle({
  client: pool,
  schema: {
    ...authSchema,
    ...schema,
  },
});
