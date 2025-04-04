
import { Review, AIReview } from "@/types/movie";
import { getMovieById } from "./movieListService";
import { generateOpenRouterReview } from "./openRouterService";
import { mockReviews, mockAIReviews } from "./mock/mockData";
import { getMockReview, getFallbackReview } from "./mock/mockHelpers";
import { areApiKeysConfigured } from "@/config/api";

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
    
    // Check if OpenRouter API key is configured
    const apiConfigured = areApiKeysConfigured();
    console.log("OpenRouter API configured:", apiConfigured);
    
    // Try to get from mock data first (if not forcing refresh and mock data exists)
    if (!forceRefresh && !apiConfigured && mockAIReviews[movieId]) {
      console.log("Using mock review from data store (no API key configured)");
      return mockAIReviews[movieId];
    }
    
    // If we have API key or force refresh, try to generate a real review
    if (apiConfigured || forceRefresh) {
      console.log("Attempting to generate AI review with OpenRouter API");
      
      try {
        // Use OpenRouter API for review generation
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
        
        console.log("AI review generation successful");
        return review;
      } catch (apiError) {
        console.error("OpenRouter API failed:", apiError);
        throw new Error("OpenRouter API failed to generate review");
      }
    }
    
    // If we get here, no API key is configured and we need a mock review
    console.log("No OpenRouter API key configured, using mock review");
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
