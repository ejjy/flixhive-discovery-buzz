
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

// Helper to check if any API keys are properly configured
export const areApiKeysConfigured = () => {
  const openRouterKey = API_CONFIG.openrouter.apiKey;
  const perplexityKey = API_CONFIG.perplexity.apiKey;
  const geminiKey = API_CONFIG.gemini.apiKey;
  
  console.log("API Key validation:", {
    openRouter: {
      exists: !!openRouterKey,
      length: openRouterKey?.length || 0,
      valid: openRouterKey && openRouterKey.length > 10,
      value: openRouterKey ? `${openRouterKey.substring(0, 5)}...` : 'none'
    },
    perplexity: {
      exists: !!perplexityKey,
      length: perplexityKey?.length || 0,
      valid: perplexityKey && perplexityKey.length > 10,
      value: perplexityKey ? `${perplexityKey.substring(0, 5)}...` : 'none'
    },
    gemini: {
      exists: !!geminiKey,
      length: geminiKey?.length || 0,
      valid: geminiKey && geminiKey.length > 10,
      value: geminiKey ? `${geminiKey.substring(0, 5)}...` : 'none'
    }
  });
  
  // Return true if any API key is valid
  return (
    (!!openRouterKey && openRouterKey.length > 10) ||
    (!!perplexityKey && perplexityKey.length > 10) ||
    (!!geminiKey && geminiKey.length > 10 && geminiKey.startsWith('AI'))
  );
};
