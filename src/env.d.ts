/// <reference types="@rsbuild/core/types" />

interface ImportMetaEnv {
  readonly APP_VERSION: string;
  readonly APP_ENVIRONMENT: 'production' | 'development' | 'preview';
  readonly APP_LOCALES: string[];
  readonly APP_NAMESPACES: string[];
  readonly CONVEX_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.svg' {
  const content: string;
  export default content;
}
declare module '*.svg?react' {
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}
