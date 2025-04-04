
import { Movie } from "@/types/movie";
import { getMovieDetailsOmdb } from "./omdbService";
import { generateOpenRouterReview } from "./openRouterService";
import { API_CONFIG } from "@/config/api";
import { mockMovies } from "./mock/mockData";

// Movies will be stored here during runtime
let populatedMovies: Movie[] = [];
let isPopulating: boolean = false;
let populationProgress: number = 0;
let totalMoviesToPopulate: number = 0;

interface PopulationStatus {
  isPopulating: boolean;
  progress: number;
  total: number;
  completed: number;
}

export const getPopulationStatus = (): PopulationStatus => {
  return {
    isPopulating,
    progress: populationProgress,
    total: totalMoviesToPopulate,
    completed: populatedMovies.length
  };
};

export const getPopulatedMovies = (): Movie[] => {
  return [...populatedMovies, ...mockMovies];
};

export const clearPopulatedMovies = (): void => {
  populatedMovies = [];
  populationProgress = 0;
  isPopulating = false;
};

export const isMoviePopulated = (movieId: number): boolean => {
  return populatedMovies.some(movie => movie.id === movieId);
};

const fetchMovieByTitle = async (title: string): Promise<Movie | null> => {
  try {
    // Generate a fake IMDb ID based on the title
    const imdbId = `tt${Math.floor(Math.random() * 9000000) + 1000000}`;
    return await getMovieDetailsOmdb(imdbId);
  } catch (error) {
    console.error(`Error fetching movie details for ${title}:`, error);
    return null;
  }
};

// List of popular movies from 1990 to present to populate
const moviesByDecade = {
  "1990s": [
    "The Shawshank Redemption", "Pulp Fiction", "The Silence of the Lambs", 
    "Schindler's List", "Forrest Gump", "Titanic", "The Matrix",
    "Fight Club", "Goodfellas", "Saving Private Ryan"
  ],
  "2000s": [
    "The Lord of the Rings: The Fellowship of the Ring", "The Dark Knight", 
    "Avatar", "Gladiator", "Memento", "The Departed", "There Will Be Blood",
    "No Country for Old Men", "Eternal Sunshine of the Spotless Mind", "Spirited Away"
  ],
  "2010s": [
    "Inception", "The Social Network", "Parasite", "Mad Max: Fury Road",
    "Interstellar", "La La Land", "Get Out", "Avengers: Endgame", 
    "The Grand Budapest Hotel", "Whiplash"
  ],
  "2020s": [
    "Dune", "The French Dispatch", "Everything Everywhere All at Once", 
    "Top Gun: Maverick", "Nomadland", "Barbie", "Oppenheimer", "Soul",
    "The Batman", "Spider-Man: No Way Home"
  ]
};

export const populateMoviesWithReviews = async (
  onProgress?: (status: PopulationStatus) => void
): Promise<Movie[]> => {
  if (isPopulating) {
    return populatedMovies;
  }
  
  isPopulating = true;
  populationProgress = 0;
  
  try {
    // Flatten all movies into a single array
    const allMovieTitles = Object.values(moviesByDecade).flat();
    totalMoviesToPopulate = allMovieTitles.length;
    
    console.log(`Starting population of ${totalMoviesToPopulate} movies`);
    
    for (let i = 0; i < allMovieTitles.length; i++) {
      const movieTitle = allMovieTitles[i];
      populationProgress = Math.floor((i / totalMoviesToPopulate) * 100);
      
      if (onProgress) {
        onProgress({
          isPopulating,
          progress: populationProgress,
          total: totalMoviesToPopulate,
          completed: i
        });
      }
      
      console.log(`Fetching movie ${i+1}/${totalMoviesToPopulate}: ${movieTitle}`);
      
      // Check if we already have this movie in our populated list
      const existingMovie = populatedMovies.find(m => 
        m.title.toLowerCase() === movieTitle.toLowerCase()
      );
      
      if (existingMovie) {
        console.log(`Movie "${movieTitle}" already exists in populated list, skipping`);
        continue;
      }
      
      // Get movie details
      const movie = await fetchMovieByTitle(movieTitle);
      
      if (movie) {
        // Ensure the movie has a unique ID (starting from 2000)
        movie.id = 2000 + populatedMovies.length;
        
        // Add to our populated movies list
        populatedMovies.push(movie);
        
        console.log(`Added movie: ${movie.title}`);
        
        // If API key is configured, also generate a review
        if (API_CONFIG.openrouter.apiKey && API_CONFIG.openrouter.apiKey.length > 10) {
          try {
            console.log(`Generating review for: ${movie.title}`);
            
            // Generate a review in the background, don't wait for it
            generateOpenRouterReview(movie.title, {
              plot: movie.overview,
              genres: movie.genres,
              ratings: movie.platformRatings?.map(r => ({
                source: r.platform, 
                value: `${r.score}/${r.outOf}`
              })),
              releaseYear: movie.releaseDate ? new Date(movie.releaseDate).getFullYear().toString() : "",
              director: movie.director || "Unknown Director",
              actors: movie.cast || []
            }).catch(err => console.error(`Error generating review for ${movie.title}:`, err));
            
          } catch (reviewError) {
            console.error(`Error generating review for ${movie.title}:`, reviewError);
          }
        }
      }
      
      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    populationProgress = 100;
    console.log(`Population complete. Added ${populatedMovies.length} movies.`);
    
    if (onProgress) {
      onProgress({
        isPopulating,
        progress: 100,
        total: totalMoviesToPopulate,
        completed: populatedMovies.length
      });
    }
    
    return populatedMovies;
  } catch (error) {
    console.error("Error during movie population:", error);
    throw error;
  } finally {
    isPopulating = false;
  }
};
