import { orgProcedure, t } from '~/trpc/trpc';
import z from 'zod';
import { zAsyncIterable } from '~/lib/zAsyncIterable';
import { tracked } from '@trpc/server';
import { sync } from '~/kubernetes/syncer';
import { db } from '~/db';
import { orgServersTable } from '~/db/schema';
import { and, eq } from 'drizzle-orm';

export const serverRouter = t.router({
  createServer: orgProcedure
    .input(
      z.object({
        slug: z.string().nonempty(),
        name: z.string().nonempty(),
      }),
    )
    .mutation(async (opts) => {
      const org = opts.ctx.org;

      await db
        .insert(orgServersTable)
        .values({
          slug: opts.input.slug,
          name: opts.input.name,
          orgId: org.id,
        })
        .returning()
        .execute();

      await sync(org);
    }),
  updateServer: orgProcedure
    .input(
      z.object({
        id: z.coerce.number().min(0),
        slug: z.string().nonempty(),
        name: z.string().nonempty(),
      }),
    )
    .mutation(async (opts) => {
      const org = opts.ctx.org;

      await db
        .update(orgServersTable)
        .set({
          slug: opts.input.slug,
          name: opts.input.name,
        })
        .where(
          and(
            eq(orgServersTable.orgId, org.id),
            eq(orgServersTable.id, opts.input.id),
          ),
        )
        .execute();

      await sync(org);
    }),
  deleteServer: orgProcedure
    .input(
      z.object({
        id: z.coerce.number().min(0),
      }),
    )
    .mutation(async (opts) => {
      const org = opts.ctx.org;

      await db
        .delete(orgServersTable)
        .where(
          and(
            eq(orgServersTable.orgId, org.id),
            eq(orgServersTable.id, opts.input.id),
          ),
        )
        .execute();

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
