
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
    const apiKey = API_CONFIG.openrouter.apiKey;
    if (!apiKey || apiKey.length < 10) {
      console.error('OpenRouter API key not properly configured');
      throw new Error('OpenRouter API credentials not configured correctly');
    }

    console.log("Starting OpenRouter API request for movie review:", movieTitle);
    
    // Format the movie data for the prompt
    const movieDetails = [
      `Title: ${movieTitle}`,
      movieData.plot ? `Plot: ${movieData.plot}` : '',
      movieData.genres?.length ? `Genres: ${movieData.genres.join(', ')}` : '',
      movieData.releaseYear ? `Year: ${movieData.releaseYear}` : '',
      movieData.director ? `Director: ${movieData.director}` : '',
      movieData.actors?.length ? `Actors: ${movieData.actors.join(', ')}` : ''
    ].filter(Boolean).join('\n');

    const prompt = `Generate a thoughtful movie review for "${movieTitle}" with the following information:
    
    ${movieDetails}
    
    Structure your response as a JSON object with the following format:
    {
      "summary": "Write 1-2 paragraphs summarizing your overall impression of the film",
      "pros": ["List 3-5 strengths of the movie"],
      "cons": ["List 3-5 weaknesses of the movie"],
      "watchRecommendation": "A final verdict on whether people should watch this movie"
    }
    
    Return ONLY valid JSON without any markdown formatting or extra text.`;

    console.log("Sending request to OpenRouter API with prompt length:", prompt.length);

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": window.location.origin,
        "X-Title": "FlixHive"
      },
      body: JSON.stringify({
        model: "anthropic/claude-3-haiku",
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
        temperature: 0.2,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      console.error(`OpenRouter API failed with status: ${response.status}`);
      throw new Error(`OpenRouter API failed with status: ${response.status}`);
    }

    const data = await response.json();
    console.log("OpenRouter API response received");
    
    // Extract and parse the JSON response
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      console.error('Invalid response from OpenRouter API');
      throw new Error('Invalid response from OpenRouter API');
    }
    
    // Handle potential JSON in markdown code blocks
    let jsonContent = content;
    if (content.includes('```')) {
      const match = content.match(/```(?:json)?\n([\s\S]*?)\n```/) || 
                    content.match(/```([\s\S]*?)```/);
      if (match && match[1]) {
        jsonContent = match[1];
      }
    }
    
    try {
      const parsedReview = JSON.parse(jsonContent.trim());
      
      return {
        summary: parsedReview.summary || "No summary available.",
        pros: Array.isArray(parsedReview.pros) ? parsedReview.pros : ["Interesting concept", "Good performances"],
        cons: Array.isArray(parsedReview.cons) ? parsedReview.cons : ["Some pacing issues", "Could be more developed"],
        watchRecommendation: parsedReview.watchRecommendation || "Consider watching if you enjoy this genre.",
        ottPopularity: []
      };
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);
      console.error('Raw content:', content);
      throw new Error('Failed to parse AI review response');
    }
  } catch (error) {
    console.error('Error using OpenRouter API:', error);
    return getFallbackReview(movieTitle);
  }
};
