import path from 'path';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import fs from 'fs';

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

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './app'),
    },
  },
  plugins: [
    TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
    tsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    react(),
  ],
  define: {
    'import.meta.env.APP_VERSION': JSON.stringify(
      process.env.npm_package_version,
    ),
    'import.meta.env.APP_ENVIRONMENT': JSON.stringify(appEnv),
    'import.meta.env.APP_LOCALES': JSON.stringify(locales),
    'import.meta.env.APP_NAMESPACES': JSON.stringify(namespaces),
  },
  server: {
    proxy: {
      '/api': 'http://localhost:8787',
    },
    headers: {
      'X-DNS-Prefetch-Control': 'on',
      'X-XSS-Protection': '1; mode=block',
      'X-Frame-Options': 'SAMEORIGIN',
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy':
        "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.posthog.com; style-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'self'; connect-src 'self' https://*.posthog.com; font-src 'self'; frame-src 'self'; img-src 'self' data: blob: https://www.gravatar.com 'self'; manifest-src 'self'; media-src 'self'; worker-src 'self' blob: data:;",
    },
  },
});
