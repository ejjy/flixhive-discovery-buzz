
import { API_CONFIG } from '@/config/api';

export const getOMDBMovieDetails = async (imdbId: string) => {
  const response = await fetch(
    `${API_CONFIG.omdb.baseUrl}/?apikey=${API_CONFIG.omdb.apiKey}&i=${imdbId}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch OMDB movie details');
  }
  
  return response.json();
};

export const searchOMDBMovies = async (title: string) => {
  const response = await fetch(
    `${API_CONFIG.omdb.baseUrl}/?apikey=${API_CONFIG.omdb.apiKey}&s=${encodeURIComponent(title)}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to search OMDB movies');
  }
  
  return response.json();
};
