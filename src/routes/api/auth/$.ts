import { createAPIFileRoute } from '@tanstack/react-start/api';
import { betterAuth } from 'better-auth';
import { admin, username } from 'better-auth/plugins';
import { passkey } from 'better-auth/plugins/passkey';
import { reactStartCookies } from 'better-auth/react-start';

const auth = betterAuth({
  socialProviders: {},
  user: {
    changeEmail: {
      enabled: true,
    },
  },
  plugins: [username(), admin(), passkey(), reactStartCookies()],
});

export const APIRoute = createAPIFileRoute('/api/auth/$')({
  GET: ({ request }) => {
    return auth.handler(request);
  },
  POST: ({ request }) => {
    return auth.handler(request);
  },
});
