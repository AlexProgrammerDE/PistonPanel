import {
  adminClient,
  apiKeyClient,
  emailOTPClient,
  oneTimeTokenClient,
  organizationClient,
  passkeyClient,
  twoFactorClient,
  usernameClient,
} from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  plugins: [
    twoFactorClient(),
    usernameClient(),
    emailOTPClient(),
    passkeyClient(),
    adminClient(),
    apiKeyClient(),
    organizationClient(),
    oneTimeTokenClient(),
  ],
});
