
import { API_CONFIG } from '@/config/api';
import { getMockReview } from './mock/mockHelpers';

export const generateAIReview = async (
  movieTitle: string,
  movieData: {
    plot?: string;
    genres?: string[];
    ratings?: { source: string; value: string }[];
    releaseYear?: string;
    director?: string;
    actors?: string[];
  }
) => {
  try {
    // Check if API keys are configured
    if (!API_CONFIG.gemini.projectId || !API_CONFIG.gemini.apiKey) {
      throw new Error('Gemini API credentials not configured');
    }

    // This would be the actual API call if credentials were properly configured
    // For now, we're returning a mock review instead
    throw new Error('Using mock data instead of API call');
    
  } catch (error) {
    console.log('Using mock AI review data instead of Gemini API');
    
    // Generate a random ID for the mock review
    const mockId = Math.floor(Math.random() * 10000);
    
    // Return a mock review with the movie title included
    return getMockReview(mockId, movieTitle);
  }
};
