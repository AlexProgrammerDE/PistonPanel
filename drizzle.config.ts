import "dotenv-flow/config";
import { defineConfig } from "drizzle-kit";
import { getEnvVar } from "./server/env";

export default defineConfig({
  out: "./drizzle",
  schema: ["./server/db/auth-schema.ts", "./server/db/schema.ts"],
  dialect: "postgresql",
  dbCredentials: {
    url: getEnvVar("DATABASE_URL"),
  },
});
