
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
  // Check OpenRouter API key since that's our primary service
  const openRouterKey = API_CONFIG.openrouter.apiKey;
  
  // Add detailed console logging for debugging
  console.log("OpenRouter API Key validation:", {
    exists: !!openRouterKey,
    length: openRouterKey?.length || 0,
    isEmpty: openRouterKey === '',
    isPlaceholder: openRouterKey.includes('placeholder'),
    value: openRouterKey ? `${openRouterKey.substring(0, 5)}...${openRouterKey.substring(openRouterKey.length - 3) || ''}` : 'none',
    envVariable: 'VITE_OPENROUTER_API_KEY',
  });

  // Key must exist, not be empty, and be reasonably long to be valid
  return !!openRouterKey && 
         openRouterKey.length > 10 && 
         !openRouterKey.includes('placeholder');
};
