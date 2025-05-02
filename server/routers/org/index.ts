import { t } from '~/trpc/trpc';
import { serverRouter } from '~/routers/org/server';
import { auditLogRouter } from '~/routers/org/audit-log';

export const orgRouter = t.router({
  server: serverRouter,
  auditLog: auditLogRouter,
});
