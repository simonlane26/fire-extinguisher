// src/env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_ENV: string
  // add more VITE_* as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
