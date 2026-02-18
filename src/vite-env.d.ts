/// <reference types="vite/client" />

declare interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_WS_URL: string;
  readonly VITE_STRIPE_PUBLIC_KEY: string;
  readonly VITE_STRIPE_SECRET_KEY: string;
  readonly NODE_ENV: string;
  readonly PROD: boolean;
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv;
}
