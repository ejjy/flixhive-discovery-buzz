
import { API_CONFIG } from '@/config/api';

export const generateAIReview = async (
  movieTitle: string,
  movieData: {
    plot?: string;
    genres?: string[];
    ratings?: { source: string; value: string }[];
    releaseYear?: string;
    director?: string;
  }
) => {
  const prompt = `
    As a film critic, write a detailed review for the movie "${movieTitle}".
    
    Movie Information:
    - Plot: ${movieData.plot || 'Not provided'}
    - Genres: ${movieData.genres?.join(', ') || 'Not provided'}
    - Release Year: ${movieData.releaseYear || 'Not provided'}
    - Director: ${movieData.director || 'Not provided'}
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

  const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_CONFIG.gemini.apiKey}`
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    })
  });

  if (!response.ok) {
    throw new Error('Failed to generate AI review');
  }

  const data = await response.json();
  return JSON.parse(data.candidates[0].content.parts[0].text);
};
