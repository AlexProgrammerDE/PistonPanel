import {
  adminClient,
  passkeyClient,
  usernameClient,
} from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: import.meta.env.CONVEX_URL,
  plugins: [usernameClient(), adminClient(), passkeyClient()],
});
