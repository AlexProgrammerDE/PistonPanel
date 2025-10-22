import { EmailTemplate } from "@daveyplate/better-auth-ui/server";
import { siteBaseUrl, siteName } from "~/config";
import { sendEmail } from "~/email/backend";
import { getEnvVar } from "~/env";

const emailFrom = getEnvVar("EMAIL_FROM");
const emailReplyTo = getEnvVar("EMAIL_REPLY_TO");

interface BaseEmailParams {
  user: {
    id: string;
    name?: string | null;
    email: string;
  };
}

interface EmailWithUrlParams extends BaseEmailParams {
  url: string;
}

interface OTPEmailParams extends BaseEmailParams {
  otp: string;
}

interface EmailOTPParams {
  email: string;
  otp: string;
  type: "sign-in" | "email-verification" | "forget-password";
}

interface InvitationEmailParams {
  id: string;
  role: string;
  email: string;
  inviter: {
    user: {
      name?: string | null;
    };
  };
  organization: {
    name: string;
  };
}

export const authEmails = {
  async sendPasswordReset({ user, url }: EmailWithUrlParams) {
    const name = user.name || user.email.split("@")[0];
    await sendEmail(
      emailFrom,
      user.email,
      emailReplyTo,
      `Your password reset request for ${siteName}`,
      EmailTemplate({
        action: "Reset Password",
        content: (
          <>
            <p>{`Hello ${name},`}</p>
            <p>
              You have requested to reset your password. Please click the button
              below to confirm your request.
            </p>
          </>
        ),
        heading: "Password reset request",
        siteName: siteName,
        baseUrl: siteBaseUrl,
        imageUrl: `${siteBaseUrl}/apple-touch-icon.png`,
        url,
      }),
    );
  },

  async sendEmailVerification({ user, url }: EmailWithUrlParams) {
    const name = user.name || user.email.split("@")[0];
    await sendEmail(
      emailFrom,
      user.email,
      emailReplyTo,
      `Verify your email address for ${siteName}`,
      EmailTemplate({
        action: "Verify Email",
        content: (
          <>
            <p>{`Hello ${name},`}</p>
            <p>Click the button below to verify your email address.</p>
          </>
        ),
        heading: "Verify your email address",
        siteName: siteName,
        baseUrl: siteBaseUrl,
        imageUrl: `${siteBaseUrl}/apple-touch-icon.png`,
        url,
      }),
    );
  },

  async sendChangeEmailVerification({ user, url }: EmailWithUrlParams) {
    const name = user.name || user.email.split("@")[0];
    await sendEmail(
      emailFrom,
      user.email,
      emailReplyTo,
      `Your email change verification for ${siteName}`,
      EmailTemplate({
        action: "Change Email",
        content: (
          <>
            <p>{`Hello ${name},`}</p>
            <p>
              You have requested to change your email. Please click the button
              below to confirm your request.
            </p>
          </>
        ),
        heading: "Email change verification",
        siteName: siteName,
        baseUrl: siteBaseUrl,
        imageUrl: `${siteBaseUrl}/apple-touch-icon.png`,
        url,
      }),
    );
  },

  async sendDeleteAccountVerification({ user, url }: EmailWithUrlParams) {
    const name = user.name || user.email.split("@")[0];
    await sendEmail(
      emailFrom,
      user.email,
      emailReplyTo,
      `Your account deletion request for ${siteName}`,
      EmailTemplate({
        action: "Delete Account",
        content: (
          <>
            <p>{`Hello ${name},`}</p>
            <p>
              You have requested to delete your account. Please click the button
              below to confirm your request.
            </p>
          </>
        ),
        heading: "Account deletion request",
        siteName: siteName,
        baseUrl: siteBaseUrl,
        imageUrl: `${siteBaseUrl}/apple-touch-icon.png`,
        url,
      }),
    );
  },

  async sendTwoFactorOTP({ user, otp }: OTPEmailParams) {
    const name = user.name || user.email.split("@")[0];
    await sendEmail(
      emailFrom,
      user.email,
      emailReplyTo,
      `Your verification code for ${siteName}`,
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
        heading: "Two-factor authentication code",
        siteName: siteName,
        baseUrl: siteBaseUrl,
        imageUrl: `${siteBaseUrl}/apple-touch-icon.png`,
      }),
    );
  },

  async sendEmailOTP({ email, otp, type }: EmailOTPParams) {
    if (type === "sign-in") {
      await sendEmail(
        emailFrom,
        email,
        emailReplyTo,
        `Your sign-in code for ${siteName}`,
        EmailTemplate({
          content: (
            <>
              <p>
                Your verification code is <strong>{otp}</strong>.
              </p>
              <p>If you did not request this, please ignore this email.</p>
            </>
          ),
          heading: "Sign in code",
          siteName: siteName,
          baseUrl: siteBaseUrl,
          imageUrl: `${siteBaseUrl}/apple-touch-icon.png`,
        }),
      );
    } else if (type === "email-verification") {
      await sendEmail(
        emailFrom,
        email,
        emailReplyTo,
        `Your verification code for ${siteName}`,
        EmailTemplate({
          content: (
            <>
              <p>
                Your verification code is <strong>{otp}</strong>.
              </p>
              <p>If you did not request this, please ignore this email.</p>
            </>
          ),
          heading: "Email verification code",
          siteName: siteName,
          baseUrl: siteBaseUrl,
          imageUrl: `${siteBaseUrl}/apple-touch-icon.png`,
        }),
      );
    } else if (type === "forget-password") {
      await sendEmail(
        emailFrom,
        email,
        emailReplyTo,
        `Your password reset code for ${siteName}`,
        EmailTemplate({
          content: (
            <>
              <p>
                Your password reset code is <strong>{otp}</strong>.
              </p>
              <p>If you did not request this, please ignore this email.</p>
            </>
          ),
          heading: "Password reset code",
          siteName: siteName,
          baseUrl: siteBaseUrl,
          imageUrl: `${siteBaseUrl}/apple-touch-icon.png`,
        }),
      );
    }
  },

  async sendOrganizationInvitation({
    id,
    role,
    email,
    inviter,
    organization,
  }: InvitationEmailParams) {
    await sendEmail(
      emailFrom,
      email,
      emailReplyTo,
      `You have been invited to join an organization on ${siteName}`,
      EmailTemplate({
        action: "Join Organization",
        content: (
          <>
            <p>
              {inviter.user.name} has invited you to join the organization{" "}
              {organization.name} as a {role}.
            </p>
            <p>
              Click the button below to accept the invitation and create an
              account.
            </p>
          </>
        ),
        heading: "Organization invitation",
        siteName: siteName,
        baseUrl: siteBaseUrl,
        imageUrl: `${siteBaseUrl}/apple-touch-icon.png`,
        url: `${siteBaseUrl}/auth/accept-invitation?invitationId=${id}`,
      }),
    );
  },
};
