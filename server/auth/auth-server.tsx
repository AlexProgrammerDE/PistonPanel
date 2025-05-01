import { betterAuth } from 'better-auth';
import {
  admin,
  apiKey,
  emailOTP,
  magicLink,
  oneTimeToken,
  openAPI,
  organization,
  twoFactor,
  username,
} from 'better-auth/plugins';
import { passkey } from 'better-auth/plugins/passkey';
import { db } from '~/db';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { EmailTemplate } from '@daveyplate/better-auth-ui';
import { sendEmail } from '~/email/backend';
import * as authSchema from '~/db/auth-schema';
import * as schema from '~/db/schema';
import { globalAc, globalAdmin, globalUser } from '@/auth/permissions';
import { siteBaseUrl, siteName } from '~/config';
import { emailHarmony } from 'better-auth-harmony';

const disableSignUp = true;
const emailAndPasswordEnabled = false;

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
  socialProviders: {},
  emailAndPassword: {
    enabled: emailAndPasswordEnabled,
    disableSignUp,
    requireEmailVerification: true,
    async sendResetPassword({ user, url }) {
      const name = user.name || user.email.split('@')[0];
      await sendEmail(
        user.email,
        'Your password reset request for PistonPanel',
        EmailTemplate({
          action: 'Reset Password',
          content: (
            <>
              <p>{`Hello ${name},`}</p>

              <p>
                You have requested to reset your password. Please click the
                button below to confirm your request.
              </p>
            </>
          ),
          heading: 'Password reset request',
          siteName: siteName,
          baseUrl: siteBaseUrl,
          url,
        }),
      );
    },
    autoSignIn: true,
  },
  emailVerification: {
    async sendVerificationEmail({ user, url }) {
      const name = user.name || user.email.split('@')[0];
      await sendEmail(
        user.email,
        'Verify your email address for PistonPanel',
        EmailTemplate({
          action: 'Verify Email',
          content: (
            <>
              <p>{`Hello ${name},`}</p>

              <p>Click the button below to verify your email address.</p>
            </>
          ),
          heading: 'Verify your email address',
          siteName: siteName,
          baseUrl: siteBaseUrl,
          url,
        }),
      );
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
  },
  user: {
    changeEmail: {
      enabled: true,
      async sendChangeEmailVerification({ user, url }) {
        const name = user.name || user.email.split('@')[0];
        await sendEmail(
          user.email,
          'Your email change verification for PistonPanel',
          EmailTemplate({
            action: 'Change Email',
            content: (
              <>
                <p>{`Hello ${name},`}</p>

                <p>
                  You have requested to change your email. Please click the
                  button below to confirm your request.
                </p>
              </>
            ),
            heading: 'Email change verification',
            siteName: siteName,
            baseUrl: siteBaseUrl,
            url,
          }),
        );
      },
    },
    deleteUser: {
      enabled: true,
      async sendDeleteAccountVerification({ user, url }) {
        const name = user.name || user.email.split('@')[0];
        await sendEmail(
          user.email,
          'Your account deletion request for PistonPanel',
          EmailTemplate({
            action: 'Delete Account',
            content: (
              <>
                <p>{`Hello ${name},`}</p>

                <p>
                  You have requested to delete your account. Please click the
                  button below to confirm your request.
                </p>
              </>
            ),
            heading: 'Account deletion request',
            siteName: siteName,
            baseUrl: siteBaseUrl,
            url,
          }),
        );
      },
    },
  },
  plugins: [
    emailHarmony(),
    twoFactor({
      otpOptions: {
        async sendOTP({ user, otp }) {
          const name = user.name || user.email.split('@')[0];
          await sendEmail(
            user.email,
            'Your verification code for PistonPanel',
            EmailTemplate({
              content: (
                <>
                  <p>{`Hello ${name},`}</p>

                  <p>
                    Your verification code is <strong>{otp}</strong>.
                  </p>
                  <p>If you did not request this, please ignore this email.</p>
                </>
              ),
              heading: 'Two-factor authentication code',
              siteName: siteName,
              baseUrl: siteBaseUrl,
            }),
          );
        },
      },
    }),
    username(),
    magicLink({
      disableSignUp,
      async sendMagicLink({ email, url }) {
        await sendEmail(
          email,
          'Your magic link for PistonPanel',
          EmailTemplate({
            action: 'Sign in',
            content: (
              <>
                <p>Click the button below to sign in.</p>
              </>
            ),
            heading: 'Magic link',
            siteName: siteName,
            baseUrl: siteBaseUrl,
            url,
          }),
        );
      },
    }),
    emailOTP({
      disableSignUp,
      sendVerificationOnSignUp: true,
      async sendVerificationOTP({ email, otp, type }) {
        if (type === 'sign-in') {
          await sendEmail(
            email,
            'Your sign-in code for PistonPanel',
            EmailTemplate({
              content: (
                <>
                  <p>
                    Your verification code is <strong>{otp}</strong>.
                  </p>
                  <p>If you did not request this, please ignore this email.</p>
                </>
              ),
              heading: 'Sign in code',
              siteName: siteName,
              baseUrl: siteBaseUrl,
            }),
          );
        } else if (type === 'email-verification') {
          await sendEmail(
            email,
            'Your verification code for PistonPanel',
            EmailTemplate({
              content: (
                <>
                  <p>
                    Your verification code is <strong>{otp}</strong>.
                  </p>
                  <p>If you did not request this, please ignore this email.</p>
                </>
              ),
              heading: 'Email verification code',
              siteName: siteName,
              baseUrl: siteBaseUrl,
            }),
          );
        } else if (type === 'forget-password') {
          await sendEmail(
            email,
            'Your password reset code for PistonPanel',
            EmailTemplate({
              content: (
                <>
                  <p>
                    Your password reset code is <strong>{otp}</strong>.
                  </p>
                  <p>If you did not request this, please ignore this email.</p>
                </>
              ),
              heading: 'Password reset code',
              siteName: siteName,
              baseUrl: siteBaseUrl,
            }),
          );
        }
      },
    }),
    passkey(),
    admin({
      ac: globalAc,
      roles: {
        admin: globalAdmin,
        user: globalUser,
      },
    }),
    apiKey(),
    organization({
      allowUserToCreateOrganization: true,
      cancelPendingInvitationsOnReInvite: true,
      async sendInvitationEmail({ id, role, email, inviter, organization }) {
        await sendEmail(
          email,
          'You have been invited to join an organization on PistonPanel',
          EmailTemplate({
            action: 'Join Organization',
            content: (
              <>
                <p>
                  {inviter.user.name} has invited you to join the organization{' '}
                  {organization.name} as a {role}.
                </p>

                <p>
                  Click the button below to accept the invitation and create an
                  account.
                </p>
              </>
            ),
            heading: 'Organization invitation',
            siteName: siteName,
            baseUrl: siteBaseUrl,
            url: `${siteBaseUrl}/organization/accept-invitation?id=${id}`,
          }),
        );
      },
    }),
    oneTimeToken(),
    openAPI(),
  ],
});
