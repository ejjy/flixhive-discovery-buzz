
import { Review, AIReview } from "@/types/movie";
import { getMovieById } from "./movieListService";
import { generateOpenRouterReview } from "./openRouterService";
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
    
    // Check if API keys are configured and log detailed information
    const apiConfigured = areApiKeysConfigured();
    const apiKey = API_CONFIG.openrouter.apiKey;
    
    console.log("API configuration check:", {
      apiConfigured,
      keyExists: !!apiKey,
      keyLength: apiKey?.length || 0,
      keyStart: apiKey ? apiKey.substring(0, 3) : 'none',
      mockDataExists: !!mockAIReviews[movieId],
      forceRefresh
    });
    
    // If we don't have API keys configured and we have mock data, use it
    if (!apiConfigured && !forceRefresh && mockAIReviews[movieId]) {
      console.log("Using mock review from data store");
      return mockAIReviews[movieId];
    }
    
    // If we need to generate a real review or a mock review
    if (apiConfigured || forceRefresh) {
      console.log("Attempting to generate AI review");
      
      // Check if it's a newly discovered movie (ID > 1000)
      const isNewlyDiscovered = movieId > 1000;
      
      try {
        if (apiConfigured) {
          // Use OpenRouter to generate a review
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
        } else {
          console.log("No API keys configured, using mock review");
          return getMockReview(movieData.title);
        }
      } catch (apiError) {
        console.error("API attempt failed:", apiError);
        // Generate a fallback review for the movie
        return getFallbackReview(movieData.title);
      }
    }
    
    // Default to mock review
    console.log("Using default mock review");
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
