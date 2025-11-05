/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly BASE_URL: string
  // add more env variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
