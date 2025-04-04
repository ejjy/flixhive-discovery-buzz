
interface ImportMetaEnv {
  VITE_CLERK_PUBLISHABLE_KEY: string;
  VITE_OMDB_API_KEY: string;
  VITE_GEMINI_API_KEY: string;
  VITE_OPENROUTER_API_KEY: string;
  VITE_PERPLEXITY_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
