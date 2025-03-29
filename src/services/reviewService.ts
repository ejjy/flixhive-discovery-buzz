
import { Review, AIReview } from "@/types/movie";
import { getMovieById } from "./movieListService";
import { generateAIReview } from "./geminiService";
import { mockReviews, mockAIReviews } from "./mock/mockData";
import { getMockReview, getFallbackReview } from "./mock/mockHelpers";

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
    
    // Try to get from mock data first
    if (!forceRefresh && mockAIReviews[movieId]) {
      return mockAIReviews[movieId];
    }
    
    // Generate AI review using Gemini (which now falls back to mock data)
    const aiReview = await generateAIReview(movieData.title, {
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

    return {
      ...aiReview,
      ottPopularity: [] // This would require additional streaming platform API
    };
  } catch (error) {
    console.error('Error generating AI review:', error);
    return getMockReview(movieId);
  }
};
