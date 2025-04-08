
import { Review, AIReview } from "@/types/movie";
import { getMovieById } from "./movieListService";
import { generateOpenRouterReview } from "./openRouterService";
import { generatePerplexityReview } from "./perplexityService";
import { generateAIReview as generateGeminiReview } from "./geminiService";
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
      console.error(`Movie not found with ID: ${movieId}`);
      return getFallbackReview(`Movie ID: ${movieId}`);
    }
    
    // Log available API keys for debugging
    const openRouterKey = API_CONFIG.openrouter.apiKey;
    const perplexityKey = API_CONFIG.perplexity.apiKey;
    const geminiKey = API_CONFIG.gemini.apiKey;
    
    console.log("API Keys available:", {
      openRouter: !!openRouterKey && openRouterKey.length > 10,
      perplexity: !!perplexityKey && perplexityKey.length > 10,
      gemini: !!geminiKey && geminiKey.length > 10
    });
    
    // Check if API keys are configured
    const apiConfigured = areApiKeysConfigured();
    
    console.log("API configuration check:", {
      apiConfigured,
      openRouterKeyExists: !!openRouterKey,
      openRouterKeyLength: openRouterKey?.length || 0,
      perplexityKeyExists: !!perplexityKey,
      perplexityKeyLength: perplexityKey?.length || 0,
      mockDataExists: !!mockAIReviews[movieId],
      forceRefresh
    });
    
    // If we don't have API keys configured and we have mock data, use it
    if (!apiConfigured && !forceRefresh && mockAIReviews[movieId]) {
      console.log("Using mock review from data store");
      return mockAIReviews[movieId];
    }
    
    // If we need to generate a review (real or mock)
    if (apiConfigured || forceRefresh) {
      console.log("Attempting to generate AI review");
      
      try {
        // Try all available AI services in order
        
        // 1. Try OpenRouter first if available
        if (openRouterKey && openRouterKey.length > 10) {
          try {
            console.log("Using OpenRouter API for review generation");
            const review = await generateOpenRouterReview(movieData.title, {
              plot: movieData.overview,
              genres: movieData.genres,
              ratings: movieData.platformRatings?.map(r => ({
                source: r.platform,
                value: `${r.score}/${r.outOf}`
              })) || [],
              releaseYear: movieData.releaseDate ? new Date(movieData.releaseDate).getFullYear().toString() : "",
              director: movieData.director || "Unknown Director",
              actors: movieData.cast || []
            });
            
            console.log("OpenRouter API review generation successful", review);
            return review;
          } catch (openRouterError) {
            console.error("OpenRouter attempt failed:", openRouterError);
            // Continue to next service
          }
        }
        
        // 2. Try Perplexity if available
        if (perplexityKey && perplexityKey.length > 10) {
          try {
            console.log("Using Perplexity API for review generation");
            const review = await generatePerplexityReview(movieData.title, {
              plot: movieData.overview,
              genres: movieData.genres,
              ratings: movieData.platformRatings?.map(r => ({
                source: r.platform,
                value: `${r.score}/${r.outOf}`
              })) || [],
              releaseYear: movieData.releaseDate ? new Date(movieData.releaseDate).getFullYear().toString() : "",
              director: movieData.director || "Unknown Director",
              actors: movieData.cast || []
            });
            
            console.log("Perplexity API review generation successful", review);
            return review;
          } catch (perplexityError) {
            console.error("Perplexity attempt failed:", perplexityError);
            // Continue to next service
          }
        }
        
        // 3. Try Gemini if available
        if (geminiKey && geminiKey.length > 10) {
          try {
            console.log("Using Gemini API for review generation");
            const review = await generateGeminiReview(movieData.title, {
              plot: movieData.overview,
              genres: movieData.genres,
              ratings: movieData.platformRatings?.map(r => ({
                source: r.platform,
                value: `${r.score}/${r.outOf}`
              })) || [],
              releaseYear: movieData.releaseDate ? new Date(movieData.releaseDate).getFullYear().toString() : "",
              director: movieData.director || "Unknown Director",
              actors: movieData.cast || []
            });
            
            console.log("Gemini API review generation successful", review);
            return review;
          } catch (geminiError) {
            console.error("Gemini attempt failed:", geminiError);
            // All services failed
          }
        }
        
        // If we get here, all API attempts failed
        console.log("All API attempts failed, using mock review");
        return getMockReview(movieData.title);
      } catch (apiError) {
        console.error("All API attempts failed with error:", apiError);
        // Generate a fallback review for the movie
        return getFallbackReview(movieData.title);
      }
    }
    
    // Default to mock review if no API keys are configured
    console.log("No API keys configured, using default mock review");
    return getMockReview(movieData.title);
    
  } catch (error) {
    console.error('Error generating AI review:', error);
    
    // Try to get the movie title if possible
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
