/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_CLIENT: string
    readonly VITE_DOMAIN_COOKIE: string
    // more env variables...
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}