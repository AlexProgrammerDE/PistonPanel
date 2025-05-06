import {
  adminClient,
  apiKeyClient,
  emailOTPClient,
  oneTapClient,
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
import { InferUserFromClient } from 'better-auth/types';

const globalRoleConfig = {
  admin: globalAdmin,
  user: globalUser,
};
const orgRoleConfig = {
  owner: orgOwner,
  admin: orgAdmin,
  member: orgMember,
};
const clientOptions = {
  plugins: [
    twoFactorClient(),
    usernameClient(),
    emailOTPClient(),
    passkeyClient(),
    adminClient({
      ac: globalAc,
      roles: globalRoleConfig,
    }),
    apiKeyClient(),
    organizationClient({
      ac: orgAc,
      roles: orgRoleConfig,
    }),
    oneTimeTokenClient(),
    oneTapClient({
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    }),
  ],
};
export const authClient = createAuthClient(clientOptions);
export type AppUser = InferUserFromClient<typeof clientOptions>;
export type AppGlobalRole = keyof typeof globalRoleConfig;
export type AppOrgRole = keyof typeof orgRoleConfig;
export const appGlobalRoles = Object.keys(globalRoleConfig) as [
  AppGlobalRole,
  ...AppGlobalRole[],
];
export const appOrgRoles = Object.keys(orgRoleConfig) as [
  AppOrgRole,
  ...AppOrgRole[],
];
