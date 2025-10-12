import { orgRouter } from "~/routers/org";
import { t } from "~/trpc/trpc";

export const appRouter = t.router({
  org: orgRouter,
});

export type AppRouter = typeof appRouter;
