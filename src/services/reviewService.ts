
import { Review, AIReview } from "@/types/movie";
import { getMovieById } from "./movieListService";
import { generateAIReview } from "./geminiService";
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
    
    // Check if Gemini API key is configured
    const geminiApiConfigured = areApiKeysConfigured();
    console.log("Gemini API configured:", geminiApiConfigured);
    
    // Try to get from mock data first (if not forcing refresh and mock data exists)
    if (!forceRefresh && !geminiApiConfigured && mockAIReviews[movieId]) {
      console.log("Using mock review from data store (no Gemini API key configured)");
      return mockAIReviews[movieId];
    }
    
    // If we have Gemini API key or force refresh, try to generate a real review
    if (geminiApiConfigured || forceRefresh) {
      console.log("Attempting to generate AI review with Gemini API");
      
      try {
        // Use Gemini API for review generation
        const review = await generateAIReview(movieData.title, {
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
        
        console.log("AI review generation successful");
        return review;
      } catch (geminiError) {
        console.error("Gemini API failed:", geminiError);
        throw new Error("Gemini API failed to generate review");
      }
    }
    
    // If we get here, no API key is configured and we need a mock review
    console.log("No Gemini API key configured, using mock review");
    return getMockReview(movieId);
    
  } catch (error) {
    console.error('Error generating AI review:', error);
    return getMockReview(movieId);
  }
};
