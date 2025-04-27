import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { TanStackRouterRspack } from '@tanstack/router-plugin/rspack';
import { pluginTypeCheck } from '@rsbuild/plugin-type-check';
import { pluginSvgr } from '@rsbuild/plugin-svgr';
import * as fs from 'node:fs';

const dev = process.env.NODE_ENV !== 'production';

export default defineConfig({
  plugins: [pluginReact(), pluginTypeCheck(), pluginSvgr()],
  tools: {
    rspack: {
      plugins: [
        TanStackRouterRspack({
          autoCodeSplitting: true,
        }),
      ],
      output: {
        asyncChunks: false,
      },
      module: {
        rules: [
          {
            test: /\.png$/,
            type: 'asset/inline',
          },
        ],
      },
      watchOptions: {
        ignored: /\.git|node_mobules|src-tauri/,
      },
    },
  },
  html: {
    template: './index.html',
  },
  source: {},
  output: {
    target: 'web',
    sourceMap: {
      js: dev ? 'cheap-module-source-map' : 'source-map',
      css: true,
    },
  },
  performance: {
    chunkSplit: {
      strategy: 'split-by-size',
      minSize: 300000,
      maxSize: 500000,
    },
  },
  server: {
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
