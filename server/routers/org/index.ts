import { t } from '~/trpc/trpc';
import { serverRouter } from '~/routers/org/server';
import { z } from 'zod';
import { auditLogRouter } from '~/routers/org/audit-log';

export const orgInput = z.object({
  orgId: z.string(),
});
export const orgRouter = t.router({
  server: serverRouter,
  auditLog: auditLogRouter,
});
