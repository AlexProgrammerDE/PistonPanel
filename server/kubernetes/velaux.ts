import { Configuration, ApplicationApi } from 'velaux-typescript-sdk';

const config = new Configuration({
  basePath: process.env.VELAUX_URL,
  accessToken: process.env.VELAUX_TOKEN,
});

export const appApi = new ApplicationApi(config);
