
import { AIReview } from "@/types/movie";
import { API_CONFIG } from "@/config/api";
import { getMockReview, getFallbackReview } from "../services/mock/mockHelpers";

export const generatePerplexityReview = async (
  movieTitle: string,
  movieData: {
    plot?: string;
    genres?: string[];
    ratings?: { source: string; value: string }[];
    releaseYear?: string;
    director?: string;
    actors?: string[];
  }
): Promise<AIReview> => {
  try {
    console.log("Starting Perplexity API request for movie review:", movieTitle);
    
    // Check if API key is configured
    if (!API_CONFIG.perplexity.apiKey || 
        API_CONFIG.perplexity.apiKey.length < 10) {
      console.error('Perplexity API key not properly configured');
      throw new Error('Perplexity API credentials not configured correctly');
    }
    
    console.log("Using Perplexity API key:", 
                API_CONFIG.perplexity.apiKey ? 
                `${API_CONFIG.perplexity.apiKey.substring(0, 5)}...` : 'none');

    // Format the movie data for the prompt
    const movieDetails = [
      `Title: ${movieTitle}`,
      movieData.plot ? `Plot: ${movieData.plot}` : '',
      movieData.genres?.length ? `Genres: ${movieData.genres.join(', ')}` : '',
      movieData.releaseYear ? `Year: ${movieData.releaseYear}` : '',
      movieData.director ? `Director: ${movieData.director}` : '',
      movieData.actors?.length ? `Actors: ${movieData.actors.join(', ')}` : '',
      movieData.ratings?.length ? `Ratings: ${movieData.ratings.map(r => `${r.source}: ${r.value}`).join(', ')}` : ''
    ].filter(Boolean).join('\n');

    const promptContent = `
You are a film critic with deep knowledge of cinema, with access to search online for information from Wikipedia, Rotten Tomatoes, IMDb, and OTT platforms like Netflix, Amazon Prime, Disney+, HBO Max, Hulu.

For the movie "${movieTitle}" (genres: ${movieData.genres?.join(', ') || 'unknown'}), described as: "${movieData.plot || 'No plot available'}"
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

Return ONLY the JSON with no additional text or explanation.`;

    console.log("Sending request to Perplexity API");

    // Make the API call to Perplexity
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_CONFIG.perplexity.apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.1-sonar-small-128k-online",
        messages: [
          {
            role: "system",
            content: "You are a film critic AI that provides detailed and accurate movie reviews based on available online information. Always return responses in valid JSON format."
          },
          {
            role: "user",
            content: promptContent,
          },
        ],
        temperature: 0.2,
        top_p: 0.9,
        max_tokens: 1000,
        return_images: false,
        return_related_questions: false,
        search_domain_filter: ["perplexity.ai"],
        search_recency_filter: "month",
        frequency_penalty: 1,
        presence_penalty: 0
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Perplexity API error:", errorData);
      console.error(`Status: ${response.status}, Status Text: ${response.statusText}`);
      throw new Error(`Perplexity API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Perplexity API response received");
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error("Unexpected API response format:", data);
      throw new Error("Unexpected API response format");
    }
    
    const aiReviewText = data.choices[0].message.content.trim();
    
    // Parse the JSON response
    try {
      console.log("Attempting to parse AI response");
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
    console.error("Error generating AI review with Perplexity:", error);
    // Return a mock review instead of throwing an error
    return getFallbackReview(movieTitle);
  }
};
