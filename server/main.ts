import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { auth } from './auth/auth-server';
import { logger } from 'hono/logger';

const app = new Hono();

app.use(logger());
app.get('/', (c) => c.text('Hello Hono!'));

app.on(['POST', 'GET'], '/api/auth/*', (c) => {
  return auth.handler(c.req.raw);
});

serve({
  ...app,
  port: 8787,
});
