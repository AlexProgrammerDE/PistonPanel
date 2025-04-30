import { initTRPC, TRPCError } from '@trpc/server';
import { OpenApiMeta } from 'trpc-to-openapi';
import z from 'zod';
import { Context } from '~/api/trpc-context';

export const t = initTRPC.context<Context>().meta<OpenApiMeta>().create();

export const protectedProcedure = t.procedure.use(
  async function isAuthed(opts) {
    const { ctx } = opts;
    if (!ctx.user || !ctx.session) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    return opts.next({
      ctx: {
        user: ctx.user,
        session: ctx.session,
      },
    });
  },
);

export const appRouter = t.router({
  sayHello: protectedProcedure
    .meta({ openapi: { method: 'GET', path: '/say-hello' } })
    .input(z.object({ name: z.string() }))
    .output(z.object({ greeting: z.string() }))
    .query(({ input }) => {
      return { greeting: `Hello ${input.name}!` };
    }),
});

export type AppRouter = typeof appRouter;
