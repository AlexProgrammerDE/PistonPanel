import EventEmitter, { on } from "node:events";
import { LineStream } from "byline";
import { and, eq } from "drizzle-orm";
import z from "zod";
import { checkPermission } from "~/auth/helpers";
import { k8sAppNamespace } from "~/config";
import { db } from "~/db";
import { orgServersTable } from "~/db/schema";
import { k8sLogApi } from "~/kubernetes/client";
import { sync } from "~/kubernetes/syncer";
import { orgProcedure, t } from "~/trpc/trpc";

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

      await checkPermission(
        opts.ctx.headers,
        {
          server: ["create"],
        },
        org.id,
      );

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

      await checkPermission(
        opts.ctx.headers,
        {
          server: ["update"],
        },
        org.id,
      );

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

      await checkPermission(
        opts.ctx.headers,
        {
          server: ["delete"],
        },
        org.id,
      );

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
        id: z.coerce.number().min(0),
      }),
    )
    .subscription(async function* (opts) {
      const ee = new EventEmitter();

      const logStream = new LineStream();

      logStream.on("data", (data) => {
        ee.emit("add", {
          data: String(data),
        });
      });

      opts.signal?.addEventListener("abort", () => {
        logStream.destroy();
      });

      void k8sLogApi
        .log(k8sAppNamespace, `server-${opts.input.id}-0`, "main", logStream, {
          follow: true,
        })
        .then((logAbort) => {
          if (opts.signal?.aborted) {
            logAbort.abort(opts.signal.reason);
          } else {
            opts.signal?.addEventListener("abort", () => {
              logAbort.abort(opts.signal?.reason);
            });
          }
        });

      for await (const [data] of on(ee, "add", {
        signal: opts.signal,
      })) {
        yield data as string;
      }
    }),
});
