
import { API_CONFIG } from '@/config/api';
import { Movie } from '@/types/movie';
import { mockMovies } from './mock/mockData';

// Utility function to convert OMDB movie data to our Movie type
const convertOmdbMovieToMovie = (omdbMovie: any): Movie => {
  // Extract ratings from OMDB format
  const platformRatings = omdbMovie.Ratings?.map((rating: any) => {
    let platform = rating.Source;
    let score = 0;
    let outOf = 10;

    // Convert different rating formats to our standard
    if (platform === 'Internet Movie Database') {
      platform = 'IMDb';
      const [scoreStr, outOfStr] = rating.Value.split('/');
      score = parseFloat(scoreStr);
      outOf = parseInt(outOfStr);
    } else if (platform === 'Rotten Tomatoes') {
      const percentValue = parseInt(rating.Value);
      score = percentValue;
      outOf = 100;
    } else if (platform === 'Metacritic') {
      const [scoreStr, outOfStr] = rating.Value.split('/');
      score = parseInt(scoreStr);
      outOf = parseInt(outOfStr);
    }

    return { platform, score, outOf };
  }) || [];

  // Parse runtime from "123 min" format to number
  const runtimeMatch = omdbMovie.Runtime?.match(/(\d+)/);
  const runtime = runtimeMatch ? parseInt(runtimeMatch[1]) : undefined;

  // Generate a numeric ID from the imdbID by removing the 'tt' prefix
  const id = omdbMovie.imdbID ? parseInt(omdbMovie.imdbID.replace('tt', ''), 10) : Math.floor(Math.random() * 10000);

  // Convert genres string to array
  const genres = omdbMovie.Genre ? omdbMovie.Genre.split(', ') : [];

  // Convert actors string to array
  const cast = omdbMovie.Actors ? omdbMovie.Actors.split(', ') : [];

  // Construct poster and backdrop paths (if available)
  const posterPath = omdbMovie.Poster && omdbMovie.Poster !== 'N/A' 
    ? omdbMovie.Poster 
    : "https://image.tmdb.org/t/p/w500/placeholder.svg";
  
  // We don't have backdrop from OMDB, use poster or a placeholder
  const backdropPath = posterPath;

  return {
    id,
    title: omdbMovie.Title || 'Unknown Title',
    overview: omdbMovie.Plot || 'No plot available',
    posterPath,
    backdropPath,
    releaseDate: omdbMovie.Released || omdbMovie.Year || new Date().toISOString().split('T')[0],
    voteAverage: parseFloat(omdbMovie.imdbRating) || 5.0,
    genres,
    runtime,
    director: omdbMovie.Director || 'Unknown',
    cast,
    platforms: [], // OMDB doesn't provide streaming platforms
    platformRatings
  };
};

export const searchMoviesOmdb = async (query: string): Promise<Movie[]> => {
  try {
    if (!API_CONFIG.omdb.apiKey) {
      throw new Error('OMDB API key not configured');
    }

    const response = await fetch(`https://www.omdbapi.com/?apikey=${API_CONFIG.omdb.apiKey}&s=${encodeURIComponent(query)}&type=movie`);
    
    if (!response.ok) {
      throw new Error(`OMDB API search failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.Response === 'False') {
      console.log('OMDB search returned no results:', data.Error);
      return [];
    }
    
    // Get detailed info for each search result (up to 5 results to avoid rate limits)
    const moviePromises = data.Search.slice(0, 5).map(async (result: any) => {
      return await getMovieDetailsOmdb(result.imdbID);
    });
    
    const movies = await Promise.all(moviePromises);
    return movies.filter((movie): movie is Movie => movie !== null);
    
  } catch (error) {
    console.error('Error searching movies via OMDB:', error);
    
    // Fall back to mock data
    const mockResults = mockMovies.filter(movie => 
      movie.title.toLowerCase().includes(query.toLowerCase()) ||
      movie.overview.toLowerCase().includes(query.toLowerCase())
    );
    
    return mockResults.length > 0 ? mockResults : [];
  }
};

export const getMovieDetailsOmdb = async (imdbId: string): Promise<Movie | null> => {
  try {
    if (!API_CONFIG.omdb.apiKey) {
      throw new Error('OMDB API key not configured');
    }

    const response = await fetch(`https://www.omdbapi.com/?apikey=${API_CONFIG.omdb.apiKey}&i=${imdbId}&plot=full`);
    
    if (!response.ok) {
      throw new Error(`OMDB API details fetch failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.Response === 'False') {
      console.log('OMDB details returned error:', data.Error);
      return null;
    }
    
    return convertOmdbMovieToMovie(data);
    
  } catch (error) {
    console.error('Error fetching movie details via OMDB:', error);
    
    // Try to find in mock data as fallback
    const numericId = parseInt(imdbId.replace('tt', ''), 10);
    const mockMovie = mockMovies.find(m => m.id === numericId);
    
    return mockMovie || null;
  }
};
