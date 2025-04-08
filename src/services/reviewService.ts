
import { Review, AIReview, Movie } from "@/types/movie";
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

export const getAIReview = async (movie: Movie, forceRefresh = false): Promise<AIReview> => {
  try {
    if (!movie || !movie.title) {
      console.error("Invalid movie metadata");
      return getFallbackReview("Invalid movie metadata");
    }
    
    console.log("getAIReview called for movie:", movie.title, "forceRefresh:", forceRefresh);
    console.log("🧠 Generating AI Review for:", {
      title: movie.title,
      hasPlot: !!movie.overview,
      genres: movie.genres?.length,
      releaseYear: movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : null,
    });
    
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
      mockDataExists: !!mockAIReviews[movie.id],
      forceRefresh
    });
    
    // If we don't have API keys configured and we have mock data, use it
    if (!apiConfigured && !forceRefresh && mockAIReviews[movie.id]) {
      console.log("Using mock review from data store");
      return mockAIReviews[movie.id];
    }
    
    // If we need to generate a review (real or mock)
    if (apiConfigured || forceRefresh) {
      console.log("Attempting to generate AI review");
      
      try {
        // Prepare movie information for AI services
        const movieInfo = {
          plot: movie.overview,
          genres: movie.genres,
          ratings: movie.platformRatings?.map(r => ({
            source: r.platform,
            value: `${r.score}/${r.outOf}`
          })) || [],
          releaseYear: movie.releaseDate ? new Date(movie.releaseDate).getFullYear().toString() : "",
          director: movie.director || "Unknown Director",
          actors: movie.cast || []
        };
        
        // Try all available AI services in order
        
        // 1. Try OpenRouter first if available
        if (openRouterKey && openRouterKey.length > 10) {
          try {
            console.log("Using OpenRouter API for review generation");
            const review = await generateOpenRouterReview(movie.title, movieInfo);
            
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
            const review = await generatePerplexityReview(movie.title, movieInfo);
            
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
            const review = await generateGeminiReview(movie.title, movieInfo);
            
            console.log("Gemini API review generation successful", review);
            return review;
          } catch (geminiError) {
            console.error("Gemini attempt failed:", geminiError);
            // All services failed
          }
        }
        
        // If we get here, all API attempts failed
        console.log("All API attempts failed, using mock review");
        return getMockReview(movie.title);
      } catch (apiError) {
        console.error("All API attempts failed with error:", apiError);
        // Generate a fallback review for the movie
        return getFallbackReview(movie.title);
      }
    }
    
    // Default to mock review if no API keys are configured
    console.log("No API keys configured, using default mock review");
    return getMockReview(movie.title);
    
  } catch (error) {
    console.error('Error generating AI review:', error);
    return getFallbackReview(movie.title);
  }
};
