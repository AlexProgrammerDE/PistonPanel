import { betterAuth } from 'better-auth';
import {
  admin,
  apiKey,
  emailOTP,
  haveIBeenPwned,
  oneTap,
  oneTimeToken,
  openAPI,
  organization,
  twoFactor,
  username,
} from 'better-auth/plugins';
import { passkey } from 'better-auth/plugins/passkey';
import { db } from '~/db';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import * as authSchema from '~/db/auth-schema';
import * as schema from '~/db/schema';
import {
  globalAc,
  globalRoleConfig,
  orgAc,
  orgRoleConfig,
} from '@/auth/permissions';
import { siteBaseUrl, siteName } from '~/config';
import { emailHarmony } from 'better-auth-harmony';
import { authEmails } from '~/auth/auth-emails';

const disableSignUp = true;

function emailToUniqueUsername(email: string): string {
  // Use the email prefix as the username, removing any not allowed characters
  // Add a random suffix to ensure uniqueness
  const prefix = email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '');
  const suffix = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${suffix}`;
}

export const auth = betterAuth({
  appName: siteName,
  baseURL: siteBaseUrl,
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      ...authSchema,
      ...schema,
    },
  }),
  account: {
    accountLinking: {
      enabled: true,
    },
  },
  socialProviders: {
    google: {
      disableSignUp,
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    microsoft: {
      disableSignUp,
      clientId: process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID!,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
    },
    discord: {
      disableSignUp,
      clientId: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const customTypedUser = user as unknown as typeof user & {
            username?: string;
            displayUsername?: string;
          };
          const uniqueUsername = emailToUniqueUsername(user.email);
          return {
            data: {
              ...user,
              username: customTypedUser.username || uniqueUsername,
              displayUsername:
                customTypedUser.displayUsername || uniqueUsername,
            },
          };
        },
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    disableSignUp,
    requireEmailVerification: true,
    async sendResetPassword({ user, url }): Promise<void> {
      await authEmails.sendPasswordReset({ user, url });
    },
    autoSignIn: true,
  },
  emailVerification: {
    async sendVerificationEmail({ user, url }): Promise<void> {
      await authEmails.sendEmailVerification({ user, url });
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
  },
  user: {
    changeEmail: {
      enabled: true,
      async sendChangeEmailVerification({ user, url }): Promise<void> {
        await authEmails.sendChangeEmailVerification({ user, url });
      },
    },
    deleteUser: {
      enabled: true,
      async sendDeleteAccountVerification({ user, url }): Promise<void> {
        await authEmails.sendDeleteAccountVerification({ user, url });
      },
    },
  },
  plugins: [
    emailHarmony(),
    twoFactor({
      otpOptions: {
        async sendOTP({ user, otp }): Promise<void> {
          await authEmails.sendTwoFactorOTP({ user, otp });
        },
      },
    }),
    username(),
    emailOTP({
      disableSignUp,
      sendVerificationOnSignUp: false,
      async sendVerificationOTP({ email, otp, type }): Promise<void> {
        await authEmails.sendEmailOTP({ email, otp, type });
      },
    }),
    passkey(),
    admin({
      ac: globalAc,
      roles: globalRoleConfig,
    }),
    apiKey({
      requireName: true,
      enableMetadata: true,
      defaultPrefix: 'key_',
    }),
    organization({
      ac: orgAc,
      roles: orgRoleConfig,
      allowUserToCreateOrganization: async (user): Promise<boolean> => {
        return (
          await auth.api.userHasPermission({
            body: {
              userId: user.id,
              permissions: {
                organization: ['create'],
              },
            },
          })
        ).success;
      },
      cancelPendingInvitationsOnReInvite: true,
      async sendInvitationEmail({
        id,
        role,
        email,
        inviter,
        organization,
      }): Promise<void> {
        await authEmails.sendOrganizationInvitation({
          id,
          role,
          email,
          inviter,
          organization,
        });
      },
    }),
    oneTimeToken(),
    oneTap({
      disableSignup: disableSignUp,
    }),
    openAPI(),
    haveIBeenPwned({
      customPasswordCompromisedMessage: 'Please choose a more secure password.',
    }),
  ],
});
export type Session = typeof auth.$Infer.Session;
export type Organization = typeof auth.$Infer.Organization;
export type Member = typeof auth.$Infer.Member;
export type Invitation = typeof auth.$Infer.Invitation;
