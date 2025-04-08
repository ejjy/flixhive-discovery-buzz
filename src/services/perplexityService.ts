
import { API_CONFIG } from '@/config/api';
import { AIReview } from '@/types/movie';
import { getMockReview, getFallbackReview } from './mock/mockHelpers';

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
    // Check if API key is configured
    const apiKey = API_CONFIG.perplexity.apiKey;
    
    if (!apiKey || apiKey.length < 10) {
      console.error('Perplexity API key not properly configured:', 
        apiKey ? `Key starts with ${apiKey.substring(0, 3)}... (${apiKey.length} chars)` : 'No key found');
      
      throw new Error('Perplexity API key not configured or invalid');
    }

    console.log("Starting Perplexity API request for movie review:", movieTitle);
    
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

    console.log("Sending request to Perplexity API with prompt length:", prompt.length);

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are a film critic AI that provides detailed and balanced movie reviews. Always format your response as valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        top_p: 0.9,
        max_tokens: 1000
      }),
    });

    // Log the response status for debugging
    console.log("Perplexity API response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Perplexity API failed with status: ${response.status}`, errorText);
      throw new Error(`Perplexity API failed with status: ${response.status} - ${errorText.substring(0, 100)}`);
    }

    const data = await response.json();
    console.log("Perplexity API response received:", data);
    
    // Extract the content from the response
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      console.error('Invalid response from Perplexity API', data);
      throw new Error('Invalid response from Perplexity API - no content in response');
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
    console.error('Error using Perplexity API:', error);
    return getMockReview(movieTitle);
  }
};
