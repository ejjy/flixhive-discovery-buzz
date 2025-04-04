
import { API_CONFIG } from '@/config/api';
import { AIReview } from '@/types/movie';
import { getMockReview, getFallbackReview } from './mock/mockHelpers';

export const generateOpenRouterReview = async (
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
    // Check if API key is configured
    if (!API_CONFIG.openrouter.apiKey || 
        API_CONFIG.openrouter.apiKey.length < 10) {
      console.error('OpenRouter API key not properly configured:', 
                  API_CONFIG.openrouter.apiKey ? 
                  `Key exists but may be invalid (length: ${API_CONFIG.openrouter.apiKey.length})` : 
                  'Key not found');
      throw new Error('OpenRouter API credentials not configured correctly');
    }

    console.log("Starting OpenRouter API request for movie review:", movieTitle);
    console.log("OpenRouter API key first 5 chars:", API_CONFIG.openrouter.apiKey.substring(0, 5) + '...');
    
    // Format the movie data for the prompt
    const movieDetails = [
      `Title: ${movieTitle}`,
      movieData.plot ? `Plot: ${movieData.plot}` : '',
      movieData.genres?.length ? `Genres: ${movieData.genres.join(', ')}` : '',
      movieData.releaseYear ? `Year: ${movieData.releaseYear}` : '',
      movieData.director ? `Director: ${movieData.director}` : '',
      movieData.actors?.length ? `Actors: ${movieData.actors.join(', ')}` : ''
    ].filter(Boolean).join('\n');

    // Add ratings information if available
    let ratingsText = '';
    if (movieData.ratings && movieData.ratings.length > 0) {
      ratingsText = 'Ratings: ' + movieData.ratings.map(r => `${r.source}: ${r.value}`).join(', ');
      movieDetails.concat('\n' + ratingsText);
    }

    const prompt = `Generate a thoughtful movie review for "${movieTitle}" with the following information:
    
    ${movieDetails}
    
    Please structure your response in JSON format with the following sections:
    1. summary: A concise overall impression of the film (1-2 paragraphs)
    2. pros: An array of 3-5 strengths of the movie
    3. cons: An array of 3-5 weaknesses of the movie
    4. watchRecommendation: Your final verdict on whether people should watch this movie and why
    
    Make the review insightful, balanced, and helpful for someone deciding whether to watch the film.
    
    Return ONLY valid JSON with no additional text, comments or markdown formatting.`;

    console.log("Sending request to OpenRouter API");

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_CONFIG.openrouter.apiKey}`,
          "HTTP-Referer": window.location.origin, // Recommended for including your site URL
          "X-Title": "FlixHive" // Optional - Name of your app
        },
        body: JSON.stringify({
          model: "anthropic/claude-3-haiku", // Using Claude which is good at structured outputs
          messages: [
            {
              role: "system",
              content: "You are a film critic AI that provides detailed and balanced movie reviews. Always format your response as valid JSON."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.2, // Low temperature for more predictable, structured output
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`OpenRouter API failed with status: ${response.status}`, errorText);
        throw new Error(`OpenRouter API failed with status: ${response.status}`);
      }

      console.log("Received response from OpenRouter API");
      const data = await response.json();
      
      try {
        // Extract the content from OpenRouter response
        const content = data.choices?.[0]?.message?.content;
        
        if (!content) {
          console.error('Invalid response format from OpenRouter API', data);
          throw new Error('Invalid response format from OpenRouter API');
        }
        
        console.log("Raw OpenRouter response:", content.substring(0, 100) + "...");
        
        // Extract JSON content if it's wrapped in code blocks
        let jsonContent = content;
        const jsonMatch = content.match(/```(?:json)?\n([\s\S]*?)\n```/) || 
                          content.match(/```([\s\S]*?)```/);
        
        if (jsonMatch && jsonMatch[1]) {
          jsonContent = jsonMatch[1];
        }
        
        console.log("Attempting to parse JSON response");
        const parsedReview = JSON.parse(jsonContent.trim());
        
        console.log("Successfully parsed OpenRouter response into JSON");
        return {
          summary: parsedReview.summary || "Couldn't generate a proper summary.",
          pros: parsedReview.pros || ["Interesting performances", "Unique visual style", "Engaging story"],
          cons: parsedReview.cons || ["Pacing issues", "Underdeveloped characters", "Predictable plot points"],
          watchRecommendation: parsedReview.watchRecommendation || "Worth watching despite its flaws.",
          ottPopularity: []
        };
      } catch (parseError) {
        console.error('Error parsing OpenRouter response:', parseError);
        console.error('Raw response content:', data.choices?.[0]?.message?.content);
        throw new Error('Failed to parse AI review response');
      }
    } catch (fetchError) {
      console.error('Error making request to OpenRouter API:', fetchError);
      throw fetchError;
    }
  } catch (error) {
    console.error('Error using OpenRouter API:', error);
    
    // Generate a review based on the movie title
    return getFallbackReview(movieTitle);
  }
};
