
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import MovieCard from '@/components/MovieCard';
import { Skeleton } from '@/components/ui/skeleton';
import { getTrendingMovies } from '@/services/movieService';
import { TrendingUp } from 'lucide-react';

const Trending = () => {
  const { data: trendingMovies, isLoading } = useQuery({
    queryKey: ['trendingMovies'],
    queryFn: getTrendingMovies,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <TrendingUp className="w-8 h-8 text-flixhive-accent" />
          <h1 className="text-3xl font-bold">Trending Movies</h1>
        </div>
        
        <p className="text-gray-400 mb-8">
          Discover the most talked-about and popular movies right now. Updated daily based on user engagement and global trends.
        </p>
        
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {Array(10).fill(0).map((_, index) => (
              <Skeleton key={index} className="aspect-[2/3] w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <>
            {trendingMovies && trendingMovies.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {trendingMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-gray-400">No trending movies available at the moment.</p>
              </div>
            )}
          </>
        )}
      </main>
      
      <footer className="bg-flixhive-dark py-8 text-center text-white/60">
        <div className="container mx-auto px-4">
          <p>© 2024 FlixHive - AI-Powered Movie Reviews and Recommendations</p>
        </div>
      </footer>
    </div>
  );
};

export default Trending;
