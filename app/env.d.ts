/// <reference types="@rsbuild/core/types" />

interface ImportMetaEnv {
  readonly APP_VERSION: string;
  readonly APP_ENVIRONMENT: "production" | "development" | "preview";
  readonly APP_LOCALES: string[];
  readonly APP_NAMESPACES: string[];
  readonly VITE_POSTHOG_KEY: string;
  readonly VITE_POSTHOG_HOST: string;
  readonly VITE_GOOGLE_CLIENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
