import { orgProcedure, t } from '~/trpc/trpc';

export const auditLogRouter = t.router({
  getAuditLogs: orgProcedure.query(function (opts) {
    return [];
  }),
});
