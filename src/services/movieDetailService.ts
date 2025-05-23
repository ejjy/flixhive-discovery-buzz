
import { Movie } from "@/types/movie";
import { getMovieDetailsOmdb } from "./omdbService";
import { mockMovies } from "./mock/mockData";

export const getMovieDetails = async (imdbId: string): Promise<Movie> => {
  try {
    // Try to get movie details from OMDB API
    const movie = await getMovieDetailsOmdb(imdbId);
    
    if (movie) {
      return movie;
    }
    
    // If OMDB failed or returned nothing, look in mock data
    const numericId = parseInt(imdbId.replace('tt', ''), 10);
    const foundMovie = mockMovies.find(movie => movie.id === numericId);
    
    if (foundMovie) {
      return foundMovie;
    }
    
    // If not found in mock data either, return a generated placeholder movie
    return {
      id: numericId || Math.floor(Math.random() * 10000),
      title: `Movie ${imdbId}`,
      overview: "No details available for this movie at the moment.",
      posterPath: "https://image.tmdb.org/t/p/w500/placeholder.svg",
      backdropPath: "https://image.tmdb.org/t/p/original/placeholder.svg",
      releaseDate: new Date().toISOString().split('T')[0],
      voteAverage: 5.0,
      genres: ["Unknown"],
      runtime: 120,
      director: "Unknown Director",
      cast: ["Actor 1", "Actor 2"],
      platforms: [],
      platformRatings: [
        { platform: "IMDb", score: 5.0, outOf: 10 }
      ]
    };
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};
