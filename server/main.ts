// Must be first
import 'dotenv-flow/config';

import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { auth } from './auth/auth-server';
import { logger } from 'hono/logger';
import { appRouter } from '~/routers/app';
import { createContext } from '~/trpc/trpc-context';
import { trpcServer } from '@hono/trpc-server';

const app = new Hono();

app.use(logger());
app.get('/', (c) => c.text('Hello World!'));

app.on(['POST', 'GET'], '/api/auth/*', (c) => {
  return auth.handler(c.req.raw);
});

app.use(
  '/api/trpc/*',
  trpcServer({
    router: appRouter,
    createContext: (_opts, c) => createContext(c.req.raw),
  }),
);

serve({
  ...app,
  port: 8787,
});
