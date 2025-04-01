
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
  // Check if Gemini API key exists and isn't an empty string or placeholder
  const geminiKey = API_CONFIG.gemini.apiKey;
  
  // Add detailed console logging for debugging
  console.log("Gemini API Key validation:", {
    exists: !!geminiKey,
    length: geminiKey?.length || 0,
    validPrefix: geminiKey?.startsWith('AI')
  });
  
  return !!geminiKey && 
         geminiKey.length > 10 && 
         geminiKey.startsWith('AI') &&
         !geminiKey.includes('your_gemini_api_key_here');
};
