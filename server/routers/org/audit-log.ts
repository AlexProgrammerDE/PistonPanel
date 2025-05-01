import { protectedProcedure, t } from '~/trpc/trpc';
import { orgInput } from '~/routers/org/index';

export const serverRouter = t.router({
  getAuditLogs: protectedProcedure.input(orgInput).query(function (opts) {
    return [];
  }),
});
