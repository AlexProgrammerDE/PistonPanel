import { initTRPC } from '@trpc/server';
import { OpenApiMeta } from 'trpc-to-openapi';
import z from 'zod';

export const t = initTRPC.meta<OpenApiMeta>().create();
export const appRouter = t.router({
  sayHello: t.procedure
    .meta({ openapi: { method: 'GET', path: '/say-hello' } })
    .input(z.object({ name: z.string() }))
    .output(z.object({ greeting: z.string() }))
    .query(({ input }) => {
      return { greeting: `Hello ${input.name}!` };
    }),
});
