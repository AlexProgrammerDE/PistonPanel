import { orgProcedure, t } from "~/trpc/trpc";

export const auditLogRouter = t.router({
  getAuditLogs: orgProcedure.query((_opts) => []),
});
