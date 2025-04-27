import GitHub from '@auth/core/providers/github';
import Google from '@auth/core/providers/google';
import Apple from '@auth/core/providers/apple';
import { convexAuth } from '@convex-dev/auth/server';
import { ResendOTP } from './otp/ResendOTP';

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    GitHub,
    Google,
    Apple({
      clientSecret: process.env.AUTH_APPLE_SECRET!,
      client: {
        token_endpoint_auth_method: 'client_secret_post',
      },
      profile: undefined,
    }),
    ResendOTP,
  ],
  callbacks: {
    createOrUpdateUser: (ctx, args) => {
      if (args.existingUserId === null) {
        throw new Error('User not found');
      }

      return Promise.resolve(args.existingUserId);
    },
  },
});
