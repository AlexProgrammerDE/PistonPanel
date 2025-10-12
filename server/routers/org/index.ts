import { auditLogRouter } from "~/routers/org/audit-log";
import { databaseRouter } from "~/routers/org/database";
import { serverRouter } from "~/routers/org/server";
import { t } from "~/trpc/trpc";

export const orgRouter = t.router({
  server: serverRouter,
  database: databaseRouter,
  auditLog: auditLogRouter,
});
