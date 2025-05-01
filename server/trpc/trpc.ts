import { initTRPC, TRPCError } from '@trpc/server';
import { Context } from '~/trpc/trpc-context';

export const t = initTRPC.context<Context>().create();

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
