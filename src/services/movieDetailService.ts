
import { Movie } from "@/types/movie";
import { getOMDBMovieDetails } from "./omdbService";

export const getMovieDetails = async (imdbId: string): Promise<Movie> => {
  try {
    // Get OMDB details
    const omdbData = await getOMDBMovieDetails(imdbId);
    
    // Map OMDB data to our Movie type
    const movieData: Movie = {
      id: parseInt(omdbData.imdbID.replace('tt', ''), 10) || Math.floor(Math.random() * 10000),
      title: omdbData.Title,
      overview: omdbData.Plot,
      posterPath: omdbData.Poster !== 'N/A' ? omdbData.Poster : 'https://image.tmdb.org/t/p/w500/placeholder.svg',
      backdropPath: 'https://image.tmdb.org/t/p/original/placeholder.svg', // OMDB doesn't provide backdrop images
      releaseDate: omdbData.Released !== 'N/A' ? omdbData.Released : omdbData.Year,
      voteAverage: parseFloat(omdbData.imdbRating) || 0,
      genres: omdbData.Genre ? omdbData.Genre.split(', ') : [],
      runtime: omdbData.Runtime !== 'N/A' ? parseInt(omdbData.Runtime, 10) : undefined,
      director: omdbData.Director !== 'N/A' ? omdbData.Director : undefined,
      cast: omdbData.Actors !== 'N/A' ? omdbData.Actors.split(', ') : undefined,
      platforms: [], // OMDB doesn't provide streaming availability
      platformRatings: [
        { platform: 'IMDb', score: parseFloat(omdbData.imdbRating) || 0, outOf: 10 },
        ...(omdbData.Ratings || []).map((rating: any) => {
          if (rating.Source === 'Rotten Tomatoes') {
            return {
              platform: 'Rotten Tomatoes',
              score: parseInt(rating.Value, 10) || 0,
              outOf: 100
            };
          } else if (rating.Source === 'Metacritic') {
            return {
              platform: 'Metacritic',
              score: parseInt(rating.Value, 10) || 0,
              outOf: 100
            };
          }
          return null;
        }).filter(Boolean)
      ]
    };

    return movieData;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};
