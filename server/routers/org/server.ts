import { orgProcedure, t } from '~/trpc/trpc';
import z from 'zod';
import { zAsyncIterable } from '~/lib/zAsyncIterable';
import { tracked } from '@trpc/server';
import { sync } from '~/kubernetes/syncer';
import { db } from '~/db';
import { orgServersTable } from '~/db/schema';

export const serverRouter = t.router({
  createServer: orgProcedure
    .input(
      z.object({
        name: z.string().min(1),
        resourceId: z.string().min(1),
        component: z.enum(['server', 'database']),
      }),
    )
    .mutation(async (opts) => {
      const org = opts.ctx.org;

      await sync(org);
    }),
  subscribeLogs: orgProcedure
    .input(
      z.object({
        lastEventId: z.coerce.number().min(0).optional(),
      }),
    )
    .output(
      zAsyncIterable({
        yield: z.object({
          count: z.number(),
        }),
        tracked: true,
      }),
    )
    .subscription(async function* (opts) {
      let index = opts.input.lastEventId ?? 0;
      while (true) {
        index++;
        yield tracked('logs', {
          count: index,
        });
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      //const logStream = new LineStream();
      //
      //logStream.on('data', data => console.log(String(data)));
      //
      //await k8sLogApi.log("namespace", "pod", "container", logStream, { follow: true });
    }),
});
