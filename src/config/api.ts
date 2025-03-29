
export const API_CONFIG = {
  tmdb: {
    baseUrl: 'https://api.themoviedb.org/3',
    imageBaseUrl: 'https://image.tmdb.org/t/p',
    apiKey: import.meta.env.VITE_TMDB_API_KEY
  },
  omdb: {
    baseUrl: 'https://www.omdbapi.com',
    apiKey: import.meta.env.VITE_OMDB_API_KEY
  },
  gemini: {
    apiKey: import.meta.env.VITE_GEMINI_API_KEY
  }
};
