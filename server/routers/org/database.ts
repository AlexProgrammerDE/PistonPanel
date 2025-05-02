import { orgProcedure, t } from '~/trpc/trpc';
import z from 'zod';
import { sync } from '~/kubernetes/syncer';
import { db } from '~/db';
import { orgDatabasesTable } from '~/db/schema';
import { and, eq } from 'drizzle-orm';

export const databaseRouter = t.router({
  createDatabase: orgProcedure
    .input(
      z.object({
        slug: z.string().nonempty(),
        name: z.string().nonempty(),
      }),
    )
    .mutation(async (opts) => {
      const org = opts.ctx.org;

      await db
        .insert(orgDatabasesTable)
        .values({
          slug: opts.input.slug,
          name: opts.input.name,
          orgId: org.id,
        })
        .returning()
        .execute();

      await sync(org);
    }),
  updateDatabase: orgProcedure
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
        .update(orgDatabasesTable)
        .set({
          slug: opts.input.slug,
          name: opts.input.name,
        })
        .where(
          and(
            eq(orgDatabasesTable.orgId, org.id),
            eq(orgDatabasesTable.id, opts.input.id),
          ),
        )
        .execute();

      await sync(org);
    }),
  deleteDatabase: orgProcedure
    .input(
      z.object({
        id: z.coerce.number().min(0),
      }),
    )
    .mutation(async (opts) => {
      const org = opts.ctx.org;

      await db
        .delete(orgDatabasesTable)
        .where(
          and(
            eq(orgDatabasesTable.orgId, org.id),
            eq(orgDatabasesTable.id, opts.input.id),
          ),
        )
        .execute();

      await sync(org);
    }),
});
