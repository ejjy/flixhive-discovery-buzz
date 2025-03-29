
import { API_CONFIG } from '@/config/api';

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
  const prompt = `
    As a film critic, write a detailed review for the movie "${movieTitle}".
    
    Movie Information:
    - Plot: ${movieData.plot || 'Not provided'}
    - Genres: ${movieData.genres?.join(', ') || 'Not provided'}
    - Release Year: ${movieData.releaseYear || 'Not provided'}
    - Director: ${movieData.director || 'Not provided'}
    - Cast: ${movieData.actors?.join(', ') || 'Not provided'}
    - Ratings: ${movieData.ratings?.map(r => `${r.source}: ${r.value}`).join(', ') || 'Not provided'}
    
    Please provide:
    1. A concise summary
    2. Key strengths (pros)
    3. Potential drawbacks (cons)
    4. A final recommendation
    
    Format the response as JSON with these fields:
    {
      "summary": "string",
      "pros": ["string"],
      "cons": ["string"],
      "watchRecommendation": "string"
    }
  `;

  // Check if API keys are configured
  if (!API_CONFIG.gemini.projectId || !API_CONFIG.gemini.apiKey) {
    throw new Error('Gemini API credentials not configured');
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/projects/${API_CONFIG.gemini.projectId}/locations/us-central1/models/gemini-pro:generateContent`, 
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': API_CONFIG.gemini.apiKey
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Gemini API error:', errorData);
    throw new Error(`Failed to generate AI review: ${response.status}`);
  }

  const data = await response.json();
  
  try {
    // Extract the text content from the response
    const textContent = data.candidates[0].content.parts[0].text;
    // Parse the JSON string
    return JSON.parse(textContent);
  } catch (error) {
    console.error('Error parsing Gemini response:', error);
    throw new Error('Failed to parse Gemini response');
  }
};
