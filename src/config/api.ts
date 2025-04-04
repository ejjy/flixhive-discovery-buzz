
export const API_CONFIG = {
  omdb: {
    apiKey: import.meta.env.VITE_OMDB_API_KEY || ''
  },
  gemini: {
    apiKey: import.meta.env.VITE_GEMINI_API_KEY || ''
  },
  openrouter: {
    apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || ''
  },
  perplexity: {
    apiKey: import.meta.env.VITE_PERPLEXITY_API_KEY || ''
  }
};

// Helper to check if API keys are configured
export const areApiKeysConfigured = () => {
  // Only check OpenRouter API key
  const openRouterKey = API_CONFIG.openrouter.apiKey;
  
  // Add detailed console logging for debugging
  console.log("OpenRouter API Key validation:", {
    exists: !!openRouterKey,
    length: openRouterKey?.length || 0,
    firstFiveChars: openRouterKey ? openRouterKey.substring(0, 5) + '...' : 'none',
    isValid: !!openRouterKey && openRouterKey.length > 10
  });

  // Check if OpenRouter API key is properly configured
  return !!openRouterKey && openRouterKey.length > 10;
};
