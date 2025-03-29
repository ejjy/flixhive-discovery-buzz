
import { Movie, Review } from "@/types/movie";
import { mockMovies, mockAIReviews, mockReviews } from "./mock/mockData";

export const getTopMovies = async (): Promise<Movie[]> => {
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockMovies), 800);
  });
};

export const getTrendingMovies = async (): Promise<Movie[]> => {
  // Get all movies and sort them by OTT popularity - those with trending status on platforms
  // This simulates getting trend data from real OTT platforms
  return new Promise((resolve) => {
    setTimeout(() => {
      // Calculate OTT popularity score based on trending status and rank
      const moviesWithScores = mockMovies.map(movie => {
        const aiReview = mockAIReviews[movie.id];
        let ottScore = 0;
        
        // Calculate OTT popularity score based on trending status and rank
        if (aiReview && aiReview.ottPopularity) {
          aiReview.ottPopularity.forEach(platform => {
            if (platform.trending) ottScore += 5;
            if (platform.rank === 1) ottScore += 5;
            else if (platform.rank && platform.rank <= 3) ottScore += 3;
            else if (platform.rank && platform.rank <= 10) ottScore += 1;
          });
        }
        
        return { movie, ottScore };
      });
      
      // Sort by OTT popularity score (descending)
      const sortedMovies = [...moviesWithScores]
        .sort((a, b) => b.ottScore - a.ottScore)
        .map(item => item.movie);
      
      resolve(sortedMovies);
    }, 800);
  });
};

export const getMovieById = async (id: number): Promise<Movie | undefined> => {
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockMovies.find(movie => movie.id === id)), 500);
  });
};

// Move the getMovieReviews function to reviewService.ts as it's already implemented there
// This function was duplicated and is no longer needed here
