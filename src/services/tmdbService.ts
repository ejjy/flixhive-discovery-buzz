
import { API_CONFIG } from '@/config/api';

export const getTMDBMovieDetails = async (movieId: string) => {
  const response = await fetch(
    `${API_CONFIG.tmdb.baseUrl}/movie/${movieId}?api_key=${API_CONFIG.tmdb.apiKey}&append_to_response=credits,reviews`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch TMDB movie details');
  }
  
  return response.json();
};

export const searchTMDBMovies = async (query: string) => {
  const response = await fetch(
    `${API_CONFIG.tmdb.baseUrl}/search/movie?api_key=${API_CONFIG.tmdb.apiKey}&query=${encodeURIComponent(query)}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to search TMDB movies');
  }
  
  return response.json();
};
