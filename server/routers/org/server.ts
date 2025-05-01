import { protectedProcedure, t } from '~/trpc/trpc';
import z from 'zod';
import { zAsyncIterable } from '~/lib/zAsyncIterable';
import { tracked } from '@trpc/server';
import * as k8s from '@kubernetes/client-node';
import { LineStream } from 'byline';
import { k8sLogApi } from '~/kubernetes/client';

export const serverRouter = t.router({
  subscribeLogs: protectedProcedure
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
