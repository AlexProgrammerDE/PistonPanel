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
import {
  globalAc,
  globalAdmin,
  globalUser,
  orgAc,
  orgAdmin,
  orgMember,
  orgOwner,
} from '@/auth/permissions';

export const authClient = createAuthClient({
  plugins: [
    twoFactorClient(),
    usernameClient(),
    emailOTPClient(),
    passkeyClient(),
    adminClient({
      ac: globalAc,
      roles: {
        admin: globalAdmin,
        user: globalUser,
      },
    }),
    apiKeyClient(),
    organizationClient({
      ac: orgAc,
      roles: {
        owner: orgOwner,
        admin: orgAdmin,
        member: orgMember,
      },
    }),
    oneTimeTokenClient(),
  ],
});
