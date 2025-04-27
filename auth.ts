import { betterAuth } from 'better-auth';
import { admin, username } from 'better-auth/plugins';
import { passkey } from 'better-auth/plugins/passkey';
import { reactStartCookies } from 'better-auth/react-start';

export const auth = betterAuth({
  socialProviders: {},
  user: {
    changeEmail: {
      enabled: true,
    },
  },
  plugins: [username(), admin(), passkey(), reactStartCookies()],
});
