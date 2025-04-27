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
  .map((dirent) => dirent.name);

const namespaces = fs
  .readdirSync('./locales/en-US', { withFileTypes: true })
  .filter((dirent) => dirent.isFile())
  .map((dirent) => dirent.name.split('.')[0]);

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
      'import.meta.env.APP_VERSION': JSON.stringify(
        process.env.npm_package_version,
      ),
      'import.meta.env.APP_ENVIRONMENT': JSON.stringify(appEnv),
      'import.meta.env.APP_LOCALES': JSON.stringify(locales),
      'import.meta.env.APP_NAMESPACES': JSON.stringify(namespaces),
    },
  },
});
