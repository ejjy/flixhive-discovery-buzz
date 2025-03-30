
export const API_CONFIG = {
  omdb: {
    apiKey: import.meta.env.VITE_OMDB_API_KEY || ''
  },
  gemini: {
    apiKey: import.meta.env.VITE_GEMINI_API_KEY || ''
  },
  perplexity: {
    apiKey: import.meta.env.VITE_PERPLEXITY_API_KEY || ''
  }
};

// Helper to check if all required API keys are configured
export const areApiKeysConfigured = () => {
  // Check if any of the API keys exist
  return !!(
    API_CONFIG.gemini.apiKey || 
    API_CONFIG.perplexity.apiKey
  );
};
