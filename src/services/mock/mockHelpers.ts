
import { AIReview } from "@/types/movie";

// Helper function for getting a mock review when API key is not configured
export function getMockReview(movieId: number | string): AIReview {
  const movieIdStr = typeof movieId === 'number' ? movieId.toString() : movieId;
  
  return {
    summary: `This is a mock review for movie ID ${movieIdStr} as the API keys are not configured. Please set the API keys in your environment variables to get real AI reviews.`,
    pros: [
      "This is a mock pro point (API keys not configured)",
      "To get real AI reviews, add your API keys",
      "Set API keys in environment variables",
      "The app works without API keys, but with mock reviews"
    ],
    cons: [
      "This review is not generated by AI (missing API keys)",
      "Content is generic and not specific to the movie",
      "You're missing out on customized AI insights"
    ],
    watchRecommendation: "To get a real recommendation, please configure your API keys in the environment variables.",
    ottPopularity: [
      {
        platform: "Mock Platform",
        trending: true,
        note: "This is mock OTT popularity data (API keys not configured)"
      }
    ]
  };
}

// Helper function for fallback review when API call fails
export function getFallbackReview(movieTitle: string): AIReview {
  return {
    summary: `We couldn't generate a complete AI review for "${movieTitle}" at this time. This may be due to API limitations or connectivity issues.`,
    pros: [
      "The film has received attention from critics and audiences",
      "Movie information is available in our database",
      "You can still explore other reviews and information about this film",
      "Try searching for more specific details about the movie"
    ],
    cons: [
      "Limited information is available for a complete AI analysis",
      "Our AI review generation encountered technical difficulties",
      "You may want to check other sources for comprehensive reviews"
    ],
    watchRecommendation: "Consider checking critic and user reviews before watching this movie.",
    ottPopularity: []
  };
}
