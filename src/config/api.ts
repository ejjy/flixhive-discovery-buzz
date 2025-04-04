
export const API_CONFIG = {
  omdb: {
    apiKey: import.meta.env.VITE_OMDB_API_KEY || ''
  },
  gemini: {
    apiKey: import.meta.env.VITE_GEMINI_API_KEY || ''
  },
  openrouter: {
    apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || ''
  }
};

// Helper to check if API keys are configured
export const areApiKeysConfigured = () => {
  // Check if OpenRouter API key exists and isn't an empty string
  const openRouterKey = API_CONFIG.openrouter.apiKey;
  
  // Add detailed console logging for debugging
  console.log("OpenRouter API Key validation:", {
    exists: !!openRouterKey,
    length: openRouterKey?.length || 0
  });
  
  return !!openRouterKey && openRouterKey.length > 10;
};
