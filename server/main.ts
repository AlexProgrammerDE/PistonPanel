import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { auth } from './auth/auth-server';
import { logger } from 'hono/logger';
import { createOpenApiFetchHandler } from 'trpc-to-openapi';
import { appRouter } from '~/api/trpc';
import { swaggerUI } from '@hono/swagger-ui';
import { openApiDocument } from '~/api/openapi';
import { createContext } from '~/api/trpc-context';
import 'dotenv-flow/config';

const app = new Hono();

app.use(logger());
app.get('/', (c) => c.text('Hello World!'));

app.on(['POST', 'GET'], '/api/auth/*', (c) => {
  return auth.handler(c.req.raw);
});

app.get('/api/docs', swaggerUI({ url: '/api/openapi' }));
app.get('/api/openapi', () => {
  return Response.json(openApiDocument);
});
app.use('/api/trpc/*', async (e) => {
  return await createOpenApiFetchHandler({
    req: e.req.raw,
    endpoint: '/api/trpc',
    router: appRouter,
    createContext: () => createContext(e.req.raw),
  });
});

serve({
  ...app,
  port: 8787,
});
