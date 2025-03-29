
export const API_CONFIG = {
  omdb: {
    baseUrl: 'https://www.omdbapi.com',
    apiKey: import.meta.env.VITE_OMDB_API_KEY
  },
  gemini: {
    projectId: import.meta.env.VITE_GEMINI_PROJECT_ID,
    apiKey: import.meta.env.VITE_GEMINI_API_KEY
  }
};
