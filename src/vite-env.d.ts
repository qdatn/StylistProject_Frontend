/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_API_KEY: string;

  // Add other environment variables here
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly REACT_APP_AUTH0_DOMAIN: string;
  readonly REACT_APP_AUTH0_CLIENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
