/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
    readonly YT_API_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}