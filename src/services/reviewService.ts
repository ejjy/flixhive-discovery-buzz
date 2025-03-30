
import { Review, AIReview } from "@/types/movie";
import { getMovieById } from "./movieListService";
import { generateAIReview } from "./geminiService";
import { mockReviews, mockAIReviews } from "./mock/mockData";
import { getMockReview, getFallbackReview } from "./mock/mockHelpers";
import { areApiKeysConfigured } from "@/config/api";
import { generateMovieReviewWithAI } from "@/utils/openaiService";

export const getMovieReviews = async (movieId: number): Promise<Review[]> => {
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockReviews[movieId] || []), 600);
  });
};

export const getAIReview = async (movieId: number, forceRefresh = false): Promise<AIReview> => {
  try {
    // Get movie data first
    const movieData = await getMovieById(movieId);
    
    if (!movieData) {
      throw new Error('Movie not found');
    }
    
    // Check if API keys are configured
    const apiKeysConfigured = areApiKeysConfigured();
    
    // Try to get from mock data first (if not forcing refresh and mock data exists)
    if (!forceRefresh && !apiKeysConfigured && mockAIReviews[movieId]) {
      console.log("Using mock review from data store (no API keys configured)");
      return mockAIReviews[movieId];
    }
    
    // If we have API keys or force refresh, try to generate a real review
    if (apiKeysConfigured || forceRefresh) {
      console.log("Attempting to generate AI review with configured API");
      
      try {
        // Try Perplexity API first (newer integration)
        return await generateMovieReviewWithAI(
          movieData.title,
          movieData.overview,
          movieData.genres
        );
      } catch (perplexityError) {
        console.error("Perplexity API error:", perplexityError);
        
        // Fall back to Gemini if Perplexity fails
        try {
          return await generateAIReview(movieData.title, {
            plot: movieData.overview,
            genres: movieData.genres,
            ratings: movieData.platformRatings.map(r => ({
              source: r.platform,
              value: `${r.score}/${r.outOf}`
            })),
            releaseYear: new Date(movieData.releaseDate).getFullYear().toString(),
            director: movieData.director,
            actors: movieData.cast
          });
        } catch (geminiError) {
          console.error("Gemini API fallback also failed:", geminiError);
          throw new Error("Both AI APIs failed");
        }
      }
    }
    
    // If we get here, no API keys are configured and we need a mock review
    console.log("No API keys configured, using mock review");
    return getMockReview(movieId);
    
  } catch (error) {
    console.error('Error generating AI review:', error);
    return getMockReview(movieId);
  }
};
