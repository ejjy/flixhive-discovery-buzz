
import { Review, AIReview } from "@/types/movie";
import { getMovieById } from "./movieListService";
import { generateOpenRouterReview } from "./openRouterService";
import { generatePerplexityReview } from "../utils/perplexityService";
import { mockReviews, mockAIReviews } from "./mock/mockData";
import { getMockReview, getFallbackReview } from "./mock/mockHelpers";
import { areApiKeysConfigured } from "@/config/api";
import { API_CONFIG } from "@/config/api";

export const getMovieReviews = async (movieId: number): Promise<Review[]> => {
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockReviews[movieId] || []), 600);
  });
};

export const getAIReview = async (movieId: number, forceRefresh = false): Promise<AIReview> => {
  try {
    console.log("getAIReview called for movie ID:", movieId, "forceRefresh:", forceRefresh);
    
    // Get movie data first
    const movieData = await getMovieById(movieId);
    
    if (!movieData) {
      console.error('Movie not found');
      throw new Error('Movie not found');
    }
    
    // Check if API keys are configured
    const apiConfigured = areApiKeysConfigured();
    console.log("API keys configured:", apiConfigured);
    
    // Try to get from mock data first (if not forcing refresh and mock data exists)
    if (!forceRefresh && !apiConfigured && mockAIReviews[movieId]) {
      console.log("Using mock review from data store (no API key configured)");
      return mockAIReviews[movieId];
    }
    
    // If we have API key or force refresh, try to generate a real review
    if (apiConfigured || forceRefresh) {
      console.log("Attempting to generate AI review with available APIs");
      
      // Determine which API to use based on available keys
      const openRouterKey = API_CONFIG.openrouter.apiKey;
      const perplexityKey = API_CONFIG.perplexity.apiKey;
      const hasOpenRouter = !!openRouterKey && openRouterKey.length > 10;
      const hasPerplexity = !!perplexityKey && perplexityKey.length > 10;
      
      try {
        // First try OpenRouter if available
        if (hasOpenRouter) {
          console.log("Trying OpenRouter API for review generation");
          try {
            const review = await generateOpenRouterReview(movieData.title, {
              plot: movieData.overview,
              genres: movieData.genres,
              ratings: movieData.platformRatings.map(r => ({
                source: r.platform,
                value: `${r.score}/${r.outOf}`
              })),
              releaseYear: movieData.releaseDate ? new Date(movieData.releaseDate).getFullYear().toString() : "",
              director: movieData.director,
              actors: movieData.cast
            });
            
            console.log("OpenRouter API review generation successful");
            return review;
          } catch (openRouterError) {
            console.error("OpenRouter API failed:", openRouterError);
            // Fall through to try Perplexity if available
          }
        }
        
        // Try Perplexity as fallback
        if (hasPerplexity) {
          console.log("Trying Perplexity API for review generation");
          const review = await generatePerplexityReview(movieData.title, {
            plot: movieData.overview,
            genres: movieData.genres,
            ratings: movieData.platformRatings.map(r => ({
              source: r.platform,
              value: `${r.score}/${r.outOf}`
            })),
            releaseYear: movieData.releaseDate ? new Date(movieData.releaseDate).getFullYear().toString() : "",
            director: movieData.director,
            actors: movieData.cast
          });
          
          console.log("Perplexity API review generation successful");
          return review;
        }
        
        // If we get here, all API attempts failed
        throw new Error("All available APIs failed to generate a review");
        
      } catch (apiError) {
        console.error("All API attempts failed:", apiError);
        throw new Error("Failed to generate review with available APIs");
      }
    }
    
    // If we get here, no API key is configured and we need a mock review
    console.log("No API keys configured, using mock review");
    return getMockReview(movieId.toString());
    
  } catch (error) {
    console.error('Error generating AI review:', error);
    
    // Make sure we have a movie title to pass to getFallbackReview
    let movieTitle = `Movie ${movieId}`;
    try {
      const movie = await getMovieById(movieId);
      if (movie && movie.title) {
        movieTitle = movie.title;
      }
    } catch (e) {
      console.error("Couldn't get movie title:", e);
    }
      
    return getFallbackReview(movieTitle);
  }
};
