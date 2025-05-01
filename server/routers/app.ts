import { t } from '~/trpc/trpc';
import { orgRouter } from '~/routers/org';

export const appRouter = t.router({
  org: orgRouter,
});

export type AppRouter = typeof appRouter;
