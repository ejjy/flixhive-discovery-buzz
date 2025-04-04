
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
  // Check if OpenRouter API key exists and isn't an empty string
  const openRouterKey = API_CONFIG.openrouter.apiKey;
  const perplexityKey = API_CONFIG.perplexity.apiKey;
  
  // Add detailed console logging for debugging
  console.log("API Key validation:", {
    openRouter: {
      exists: !!openRouterKey,
      length: openRouterKey?.length || 0,
      firstFiveChars: openRouterKey ? openRouterKey.substring(0, 5) + '...' : 'none'
    },
    perplexity: {
      exists: !!perplexityKey,
      length: perplexityKey?.length || 0,
      firstFiveChars: perplexityKey ? perplexityKey.substring(0, 5) + '...' : 'none'
    }
  });

  // Check if either API key is properly configured
  return (!!openRouterKey && openRouterKey.length > 10) ||
         (!!perplexityKey && perplexityKey.length > 10);
};
