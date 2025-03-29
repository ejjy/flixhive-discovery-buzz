
// This file now serves as a main export point for all movie-related services
import { Movie, Review, AIReview } from "@/types/movie";

// Re-export all service functions
export { getTopMovies, getTrendingMovies, getMovieById } from './movieListService';
export { getMovieReviews, getAIReview } from './reviewService';
export { searchMovies } from './searchService';
export { getMovieDetails } from './movieDetailService';
export { getSavedMovies, saveMovie, unsaveMovie } from './watchlistService';
