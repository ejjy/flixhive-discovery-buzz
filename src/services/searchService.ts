
import { Movie } from "@/types/movie";
import { searchMoviesOmdb } from "./omdbService";
import { getPopulatedMovies } from "./moviePopulationService";
import { processNaturalLanguageQuery } from "./search/queryProcessor";
import { scoreMovie } from "./search/movieScoring";
import { generateMovie } from "./search/movieGenerator";

export const searchMovies = async (query: string): Promise<Movie[]> => {
  console.log(`Processing query: "${query}"...`);
  
  try {
    const analysis = processNaturalLanguageQuery(query);
    
    console.log("Analysis of query:", analysis);

    // First try with direct OMDB search
    let results: Movie[] = [];
    
    if (analysis.personType) {
      // If it's a person search, try different OMDB parameters based on person type
      if (analysis.personType === 'director') {
        results = await searchMoviesOmdb(query, { searchBy: 'director' });
      } else if (analysis.personType === 'actor' || analysis.personType === 'celebrity') {
        results = await searchMoviesOmdb(query, { searchBy: 'actor' });
        
        if (results.length === 0 && analysis.personType === 'celebrity') {
          results = await searchMoviesOmdb(query, { searchBy: 'director' });
        }
      }
    }
    
    // If no results with person search or not a person query, try regular search
    if (results.length === 0) {
      results = await searchMoviesOmdb(query);
    }

    // If we have OMDB results, use them
    if (results.length > 0) {
      console.log(`Found ${results.length} movies via API`);
      return results;
    }
    
    // If no API results, search our populated and mock data
    console.log("No API results, searching populated and mock database with intelligent scoring...");
    const allMovies = getPopulatedMovies();
    
    // Score movies based on search analysis
    const scoredMovies = allMovies.map(movie => ({
      movie,
      score: scoreMovie(movie, query, analysis)
    }));
    
    // Sort by score and take top matches
    const sortedMovies = scoredMovies
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.movie);
    
    if (sortedMovies.length > 0) {
      console.log(`Found ${sortedMovies.length} relevant movies in local database`);
      return sortedMovies.slice(0, 10); // Return top 10 most relevant
    }
    
    console.log("No matching movies found, generating a placeholder movie");
    return [generateMovie(query, analysis)];
    
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};
