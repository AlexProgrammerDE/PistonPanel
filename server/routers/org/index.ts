import { t } from '~/trpc/trpc';
import { serverRouter } from '~/routers/org/server';
import { auditLogRouter } from '~/routers/org/audit-log';
import { databaseRouter } from '~/routers/org/database';

export const orgRouter = t.router({
  server: serverRouter,
  database: databaseRouter,
  auditLog: auditLogRouter,
});
