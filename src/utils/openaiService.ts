
// We'll avoid directly referencing the API key in the code

export interface AIReviewContent {
  summary: string;
  pros: string[];
  cons: string[];
  watchRecommendation: string;
}

// Check if the API key is configured
const isApiKeyConfigured = (): boolean => {
  return !!import.meta.env.VITE_OPENAI_API_KEY && 
         import.meta.env.VITE_OPENAI_API_KEY !== 'placeholder_value_replace_in_netlify';
};

export async function generateMovieReviewWithAI(
  movieTitle: string,
  movieOverview: string,
  genres: string[]
): Promise<AIReviewContent> {
  if (!isApiKeyConfigured()) {
    console.error("OpenAI API key is not set in environment variables");
    throw new Error("API key not configured. Please set VITE_OPENAI_API_KEY in your environment variables.");
  }

  try {
    const promptContent = `
You are a film critic with deep knowledge of cinema. Please write a review for the movie "${movieTitle}".
The movie is described as: "${movieOverview}"
Genres: ${genres.join(', ')}

Write a review in this specific JSON format:
{
  "summary": "A concise overview of the movie's strengths, weaknesses, and overall impression (1-2 sentences)",
  "pros": ["List 4 positive aspects of the movie"],
  "cons": ["List 3 negative aspects or potential drawbacks of the movie"],
  "watchRecommendation": "A conclusion sentence about who would enjoy this movie and whether it's worth watching"
}

Return ONLY the JSON with no additional text or explanation.
`;

    console.log("Sending request to OpenAI API...");
    
    // Create a dynamic object for headers to avoid the key being included directly in the build
    const headers: Record<string, string> = {
      "Content-Type": "application/json"
    };
    
    // Add the authorization header dynamically
    if (import.meta.env.VITE_OPENAI_API_KEY) {
      headers["Authorization"] = `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`;
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
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const aiReviewText = data.choices[0].message.content.trim();
    
    // Parse the JSON response
    try {
      const parsedReview = JSON.parse(aiReviewText);
      return {
        summary: parsedReview.summary,
        pros: parsedReview.pros,
        cons: parsedReview.cons,
        watchRecommendation: parsedReview.watchRecommendation
      };
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      console.log("Raw AI response:", aiReviewText);
      throw new Error("Failed to parse AI response");
    }
  } catch (error) {
    console.error("Error generating AI review:", error);
    throw error;
  }
}
