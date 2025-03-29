
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
    if (!API_CONFIG.gemini.apiKey) {
      throw new Error('Gemini API credentials not configured');
    }

    // This would be the actual API call to Gemini
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_CONFIG.gemini.apiKey}`;
    
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

    const prompt = `Generate a thoughtful movie review for "${movieTitle}" with the following information:
    
    ${movieDetails}
    
    Please structure your response in JSON format with the following sections:
    1. summary: A concise overall impression of the film (1-2 paragraphs)
    2. pros: An array of 3-5 strengths of the movie
    3. cons: An array of 3-5 weaknesses of the movie
    4. watchRecommendation: Your final verdict on whether people should watch this movie and why
    
    Make the review insightful, balanced, and helpful for someone deciding whether to watch the film.`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API failed with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Parse the response to extract the JSON content
    try {
      // The Gemini response structure has the JSON embedded in text
      const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!textContent) {
        throw new Error('Invalid response format from Gemini API');
      }
      
      // Extract the JSON content from the text (it might be wrapped in ```json blocks)
      const jsonMatch = textContent.match(/```json\n([\s\S]*?)\n```/) || 
                        textContent.match(/```\n([\s\S]*?)\n```/) ||
                        [null, textContent];
      
      const jsonContent = jsonMatch[1] || textContent;
      const parsedReview = JSON.parse(jsonContent.trim());
      
      return {
        summary: parsedReview.summary || "Couldn't generate a proper summary.",
        pros: parsedReview.pros || ["Interesting performances", "Unique visual style", "Engaging story"],
        cons: parsedReview.cons || ["Pacing issues", "Underdeveloped characters", "Predictable plot points"],
        watchRecommendation: parsedReview.watchRecommendation || "Worth watching despite its flaws.",
        ottPopularity: []
      };
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      throw new Error('Failed to parse AI review response');
    }
    
  } catch (error) {
    console.log('Using mock AI review data instead of Gemini API:', error);
    
    // Generate a random ID for the mock review
    const mockId = Math.floor(Math.random() * 10000);
    
    // Return a mock review
    return getMockReview(mockId);
  }
};
