
import { Movie } from "@/types/movie";
import { mockMovies } from "./mock/mockData";

export const searchMovies = async (query: string): Promise<Movie[]> => {
  // Search mock movies
  const mockResults = mockMovies.filter(movie => 
    movie.title.toLowerCase().includes(query.toLowerCase()) ||
    movie.overview.toLowerCase().includes(query.toLowerCase())
  );
  
  if (mockResults.length > 0) {
    return mockResults;
  }
  
  // If no matching movies in our mock DB, generate a fake movie with the search term
  const generatedMovie: Movie = {
    id: 1000 + Math.floor(Math.random() * 1000), // Generate a random ID
    title: query.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "),
    overview: `A fascinating story about ${query} that takes viewers on an unexpected journey through themes of adventure, discovery, and human connection.`,
    posterPath: "https://image.tmdb.org/t/p/w500/placeholder.svg",
    backdropPath: "https://image.tmdb.org/t/p/original/placeholder.svg",
    releaseDate: new Date().toISOString().split('T')[0],
    voteAverage: 7.0 + Math.random() * 2, // Random rating between 7.0 and 9.0
    genres: ["Drama", "Adventure"],
    runtime: 90 + Math.floor(Math.random() * 60), // Random runtime between 90 and 150 minutes
    director: "Acclaimed Director",
    cast: ["Leading Actor", "Supporting Actress", "Character Actor"],
    platforms: ["Netflix", "Prime Video"],
    platformRatings: [
      { platform: "IMDb", score: 7.0 + Math.random() * 2, outOf: 10 },
      { platform: "Rotten Tomatoes", score: 70 + Math.floor(Math.random() * 25), outOf: 100 }
    ]
  };
  
  return [generatedMovie];
};
