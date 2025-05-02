import { orgProcedure, t } from '~/trpc/trpc';
import { orgInput } from '~/routers/org/index';

export const auditLogRouter = t.router({
  getAuditLogs: orgProcedure.input(orgInput).query(function (opts) {
    return [];
  }),
});
