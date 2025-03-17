
// We'll avoid directly referencing the API key in the code

export interface AIReviewContent {
  summary: string;
  pros: string[];
  cons: string[];
  watchRecommendation: string;
  ottPopularity?: {
    platform: string;
    rank?: number;
    trending?: boolean;
    note?: string;
  }[];
}

// Check if the API key is configured
const isApiKeyConfigured = (): boolean => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  return !!apiKey && 
         apiKey !== 'placeholder_value_replace_in_netlify';
};

export async function generateMovieReviewWithAI(
  movieTitle: string,
  movieOverview: string,
  genres: string[]
): Promise<AIReviewContent> {
  console.log(`Starting AI review generation for: ${movieTitle}`);
  
  if (!isApiKeyConfigured()) {
    console.log("OpenAI API key is not set - returning mock review");
    return getMockReview(movieTitle);
  }

  try {
    const promptContent = `
You are a film critic with deep knowledge of cinema, with access to search online for information from Wikipedia, Rotten Tomatoes, IMDb, and OTT platforms like Netflix, Amazon Prime, Disney+, HBO Max, Hulu.

For the movie "${movieTitle}" (genres: ${genres.join(', ')}), described as: "${movieOverview}"
1. First search for information about this movie on Wikipedia, Rotten Tomatoes, IMDb, and major streaming platforms
2. Analyze which OTT platforms currently feature this movie and how popular/trending it is on each
3. Use that information to formulate a comprehensive, well-informed review
4. Consider critic scores, audience reception, box office performance, and critical consensus if available
5. If it's a classic or older film, consider its historical significance and legacy
6. If it's a newer film, consider how it compares to similar recent films
7. Pay special attention to the movie's popularity and trending status on major streaming platforms

Write a review in this specific JSON format:
{
  "summary": "A concise overview of the movie's strengths, weaknesses, and overall impression, mentioning where data was sourced from (1-2 sentences)",
  "pros": ["List 4 positive aspects of the movie based on critical consensus and audience reception"],
  "cons": ["List 3 negative aspects or potential drawbacks of the movie based on critical consensus"],
  "watchRecommendation": "A conclusion sentence about who would enjoy this movie and whether it's worth watching, citing its Rotten Tomatoes or IMDb score if available",
  "ottPopularity": [
    {
      "platform": "Name of streaming platform where it's available (e.g., Netflix, Disney+)",
      "rank": Optional number indicating its rank in popularity if available (e.g., #5 in Top 10),
      "trending": true/false indicating if it's trending on this platform,
      "note": "A brief note about its popularity status on this platform (e.g., 'Currently in Netflix Top 10 Movies')"
    }
  ]
}

Return ONLY the JSON with no additional text or explanation.
`;

    console.log("Sending request to OpenAI API for movie:", movieTitle);
    
    // Create a dynamic object for headers to avoid the key being included directly in the build
    const headers: Record<string, string> = {
      "Content-Type": "application/json"
    };
    
    // Add the authorization header dynamically
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (apiKey) {
      headers["Authorization"] = `Bearer ${apiKey}`;
    }
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: promptContent,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("OpenAI API error:", errorData);
      console.error(`Status: ${response.status}, Status Text: ${response.statusText}`);
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("OpenAI API response received:", data);
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error("Unexpected API response format:", data);
      throw new Error("Unexpected API response format");
    }
    
    const aiReviewText = data.choices[0].message.content.trim();
    
    // Parse the JSON response
    try {
      console.log("Attempting to parse AI response:", aiReviewText);
      // First, make sure we have a valid JSON by removing any markdown formatting
      let cleanedText = aiReviewText;
      // Remove markdown code blocks if present
      if (cleanedText.startsWith("```json")) {
        cleanedText = cleanedText.replace(/```json\n|\n```/g, "");
      } else if (cleanedText.startsWith("```")) {
        cleanedText = cleanedText.replace(/```\n|\n```/g, "");
      }
      
      const parsedReview = JSON.parse(cleanedText);
      
      // Validate that the parsed review has the expected structure
      if (!parsedReview.summary || !Array.isArray(parsedReview.pros) || 
          !Array.isArray(parsedReview.cons) || !parsedReview.watchRecommendation) {
        console.error("AI response missing required fields:", parsedReview);
        throw new Error("AI response missing required fields");
      }
      
      return {
        summary: parsedReview.summary,
        pros: parsedReview.pros,
        cons: parsedReview.cons,
        watchRecommendation: parsedReview.watchRecommendation,
        ottPopularity: parsedReview.ottPopularity || []
      };
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      console.log("Raw AI response:", aiReviewText);
      throw new Error("Failed to parse AI response");
    }
  } catch (error) {
    console.error("Error generating AI review:", error);
    // Return a basic fallback review instead of throwing an error
    return getFallbackReview(movieTitle);
  }
}

// Helper function for getting a mock review when API key is not configured
function getMockReview(movieTitle: string): AIReviewContent {
  return {
    summary: `This is a mock review for "${movieTitle}" as no OpenAI API key is configured. Please set the VITE_OPENAI_API_KEY in your Netlify environment variables to get real AI reviews.`,
    pros: [
      "This is a mock pro point (API key not configured)",
      "To get real AI reviews, add your OpenAI API key",
      "Set VITE_OPENAI_API_KEY in Netlify environment variables",
      "The app works without an API key, but with mock reviews"
    ],
    cons: [
      "This review is not generated by AI (missing API key)",
      "Content is generic and not specific to the movie",
      "You're missing out on customized AI insights"
    ],
    watchRecommendation: "To get a real recommendation, please configure your OpenAI API key in the Netlify environment variables.",
    ottPopularity: [
      {
        platform: "Mock Platform",
        trending: true,
        note: "This is mock OTT popularity data (API key not configured)"
      }
    ]
  };
}

// Helper function for fallback review when API call fails
function getFallbackReview(movieTitle: string): AIReviewContent {
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
