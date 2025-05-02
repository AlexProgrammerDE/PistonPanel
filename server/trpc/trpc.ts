import { initTRPC, TRPCError } from '@trpc/server';
import { Context } from '~/trpc/trpc-context';
import { auth } from '~/auth/auth-server';

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

export const orgProcedure = protectedProcedure.use(
  async function isActiveOrg(opts) {
    const { ctx } = opts;
    if (!ctx.session.activeOrganizationId) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    const resolvedOrg = await auth.api.getFullOrganization({
      headers: ctx.headers,
      query: {
        organizationId: ctx.session.activeOrganizationId,
      },
    });

    if (!resolvedOrg) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    return opts.next({
      ctx: {
        ...ctx,
        org: resolvedOrg,
      },
    });
  },
);
