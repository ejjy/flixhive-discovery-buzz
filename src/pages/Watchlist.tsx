import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Film, AlertCircle } from 'lucide-react';
import Navbar from '@/components/navbar';
import MovieCard from '@/components/MovieCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useWatchlist } from '@/contexts/WatchlistContext';
import { getMovieById } from '@/services/movieService';
import { Movie } from '@/types/movie';
import { Link } from 'react-router-dom';

const Watchlist = () => {
  const { savedMovieIds, isLoading: isLoadingIds } = useWatchlist();
  
  // Fetch details for all saved movies
  const { data: watchlistMovies, isLoading: isLoadingMovies } = useQuery({
    queryKey: ['watchlistMovies', savedMovieIds],
    queryFn: async () => {
      if (savedMovieIds.length === 0) return [];
      
      // Fetch each movie in parallel
      const moviePromises = savedMovieIds.map(id => getMovieById(id));
      const movies = await Promise.all(moviePromises);
      
      // Filter out any undefined results
      return movies.filter(movie => movie !== undefined) as Movie[];
    },
    enabled: !isLoadingIds && savedMovieIds.length > 0,
  });
  
  const isLoading = isLoadingIds || isLoadingMovies;
  const isEmpty = !isLoading && (!watchlistMovies || watchlistMovies.length === 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">My Watchlist</h1>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {Array(6).fill(0).map((_, index) => (
              <Skeleton key={index} className="aspect-[2/3] w-full rounded-lg" />
            ))}
          </div>
        ) : isEmpty ? (
          <div className="text-center py-16">
            <Film className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Your watchlist is empty</h2>
            <p className="text-muted-foreground mb-6">
              Start adding movies to keep track of what you want to watch.
            </p>
            <Link to="/movies">
              <Button className="bg-flixhive-primary hover:bg-flixhive-primary/90">
                Browse Movies
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <p className="text-gray-400 mb-6">
              You have {watchlistMovies?.length} {watchlistMovies?.length === 1 ? 'movie' : 'movies'} in your watchlist.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {watchlistMovies?.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Watchlist;
