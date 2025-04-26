import { defineConfig } from '@tanstack/react-start/config';
import tsConfigPaths from 'vite-tsconfig-paths';
import fs from 'node:fs';

const baseEnv = process.env.VERCEL_ENV ?? process.env.NODE_ENV;
let appEnv: string;
if (baseEnv === 'production') {
  appEnv = 'production';
} else if (baseEnv === 'preview') {
  appEnv = 'preview';
} else {
  appEnv = 'development';
}

const locales = fs
  .readdirSync('./locales', { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name)
  .join(',');

const namespaces = fs
  .readdirSync('./locales/en-US', { withFileTypes: true })
  .filter((dirent) => dirent.isFile())
  .map((dirent) => dirent.name.split('.')[0])
  .join(',');

export default defineConfig({
  tsr: {
    appDirectory: 'src',
  },
  vite: {
    plugins: [
      tsConfigPaths({
        projects: ['./tsconfig.json'],
      }),
    ],
    define: {
      APP_VERSION: JSON.stringify(process.env.npm_package_version),
      APP_ENVIRONMENT: JSON.stringify(appEnv),
      APP_LOCALES: JSON.stringify(locales),
      APP_NAMESPACES: JSON.stringify(namespaces),
    },
  },
  server: {
    routeRules: {
      '*': {
        headers: {
          'X-DNS-Prefetch-Control': 'on',
          'X-XSS-Protection': '1; mode=block',
          'X-Frame-Options': 'SAMEORIGIN',
          'X-Content-Type-Options': 'nosniff',
          'Content-Security-Policy':
            "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'self'; connect-src 'self' https://aptabase.pistonmaster.net *; font-src 'self'; frame-src 'self'; img-src 'self' data: blob: https://www.gravatar.com 'self'; manifest-src 'self'; media-src 'self'; worker-src 'self';",
        },
      },
    },
  },
});
