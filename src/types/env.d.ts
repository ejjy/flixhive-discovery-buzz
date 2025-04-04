
interface ImportMetaEnv {
  VITE_OMDB_API_KEY: string;
  VITE_GEMINI_API_KEY: string;
  VITE_OPENROUTER_API_KEY: string;
  VITE_PERPLEXITY_API_KEY: string;
  
  // Firebase config variables
  VITE_FIREBASE_API_KEY: string;
  VITE_FIREBASE_AUTH_DOMAIN: string;
  VITE_FIREBASE_PROJECT_ID: string;
  VITE_FIREBASE_STORAGE_BUCKET: string;
  VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  VITE_FIREBASE_APP_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
