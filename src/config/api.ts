
export const API_CONFIG = {
  omdb: {
    apiKey: import.meta.env.VITE_OMDB_API_KEY || ''
  },
  gemini: {
    apiKey: import.meta.env.VITE_GEMINI_API_KEY || ''
  }
};

// Helper to check if Gemini API key is configured
export const areApiKeysConfigured = () => {
  // Check if Gemini API key exists
  return !!API_CONFIG.gemini.apiKey;
};
