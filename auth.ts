import { betterAuth } from 'better-auth';
import {
  admin,
  apiKey,
  emailOTP,
  oneTimeToken,
  openAPI,
  organization,
  twoFactor,
  username,
} from 'better-auth/plugins';
import { passkey } from 'better-auth/plugins/passkey';
import { reactStartCookies } from 'better-auth/react-start';
import { db } from '@/db';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

export const auth = betterAuth({
  appName: 'PistonPanel',
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  socialProviders: {},
  user: {
    changeEmail: {
      enabled: true,
    },
  },
  plugins: [
    twoFactor(),
    username(),
    // emailOTP({}), // TODO
    passkey(),
    admin(),
    apiKey(),
    organization(),
    oneTimeToken(),
    openAPI(),
    reactStartCookies(),
  ],
});
