import fs from "node:fs";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

const baseEnv = process.env.VERCEL_ENV || process.env.NODE_ENV;
let appEnv: string;
if (baseEnv === "production") {
  appEnv = "production";
} else if (baseEnv === "preview") {
  appEnv = "preview";
} else {
  appEnv = "development";
}

const locales = fs
  .readdirSync("./locales", { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

const namespaces = fs
  .readdirSync("./locales/en-US", { withFileTypes: true })
  .filter((dirent) => dirent.isFile())
  .map((dirent) => dirent.name.split(".")[0]);

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./app"),
    },
  },
  plugins: [
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    tsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tailwindcss(),
    react(),
  ],
  define: {
    "import.meta.env.APP_VERSION": JSON.stringify(
      process.env.npm_package_version,
    ),
    "import.meta.env.APP_ENVIRONMENT": JSON.stringify(appEnv),
    "import.meta.env.APP_LOCALES": JSON.stringify(locales),
    "import.meta.env.APP_NAMESPACES": JSON.stringify(namespaces),
  },
  server: {
    proxy: {
      "/api": "http://localhost:8787",
    },
    headers: {
      "X-DNS-Prefetch-Control": "on",
      "X-XSS-Protection": "1; mode=block",
      "X-Frame-Options": "SAMEORIGIN",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": [
        "default-src 'self';",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.posthog.com https://accounts.google.com/gsi/client https://challenges.cloudflare.com https://va.vercel-scripts.com https://vercel.live;",
        "style-src 'self' 'unsafe-inline' https://*.posthog.com https://accounts.google.com/gsi/style https://vercel.live;",
        "object-src 'none';",
        "base-uri 'self';",
        "connect-src 'self' https://discord.com https://*.posthog.com https://accounts.google.com/gsi/ https://vercel.com https://vercel.live wss://ws-us3.pusher.com;",
        "font-src 'self' https://*.posthog.com https://vercel.live https://assets.vercel.com;",
        "frame-src 'self' https://accounts.google.com/gsi/ https://challenges.cloudflare.com https://vercel.live;",
        "img-src 'self' data: blob: https://vercel.live https://vercel.com https://*.posthog.com https://gravatar.com https://www.gravatar.com https://accounts.google.com/gsi/;",
        "manifest-src 'self';",
        "media-src 'self' https://*.posthog.com;",
        "worker-src 'self' blob: data:;",
        "frame-ancestors 'self' https://*.posthog.com;",
        "upgrade-insecure-requests",
      ].join(" "),
    },
  },
});
