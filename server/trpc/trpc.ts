import { initTRPC, TRPCError } from '@trpc/server';
import { Context } from '~/trpc/trpc-context';
import { auth } from '~/auth/auth-server';
import { z } from 'zod';

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

export const orgProcedure = protectedProcedure
  .input(z.object({ organizationId: z.string() }))
  .use(async function isActiveOrg(opts) {
    const resolvedOrg = await auth.api.getFullOrganization({
      headers: opts.ctx.headers,
      query: {
        organizationId: opts.input.organizationId,
      },
    });

    if (!resolvedOrg) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    return opts.next({
      ctx: {
        ...opts.ctx,
        org: resolvedOrg,
      },
    });
  });
