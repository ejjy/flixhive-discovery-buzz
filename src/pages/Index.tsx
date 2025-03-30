import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/navbar';
import FeaturedMovie from '@/components/FeaturedMovie';
import MovieSection from '@/components/MovieSection';
import { Skeleton } from '@/components/ui/skeleton';
import { getTopMovies, getTrendingMovies } from '@/services/movieService';
import { Movie } from '@/types/movie';

const Index = () => {
  const { data: topMovies, isLoading: isLoadingTop } = useQuery({
    queryKey: ['topMovies'],
    queryFn: getTopMovies,
  });

  const { data: trendingMovies, isLoading: isLoadingTrending } = useQuery({
    queryKey: ['trendingMovies'],
    queryFn: getTrendingMovies,
  });

  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  
  useEffect(() => {
    if (topMovies && topMovies.length > 0) {
      // Select a random movie from the top movies as the featured one
      const randomIndex = Math.floor(Math.random() * Math.min(3, topMovies.length));
      setFeaturedMovie(topMovies[randomIndex]);
    }
  }, [topMovies]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-flixhive-dark to-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pb-12">
        {/* Featured Movie Banner */}
        {isLoadingTop || !featuredMovie ? (
          <div className="mt-6">
            <Skeleton className="w-full h-[60vh] md:h-[70vh] rounded-lg" />
          </div>
        ) : (
          <div className="mt-6">
            <FeaturedMovie movie={featuredMovie} />
          </div>
        )}
        
        {/* Trending Now Section */}
        <MovieSection 
          title="Trending Now" 
          movies={trendingMovies || []} 
          isLoading={isLoadingTrending} 
          linkTo="/movies?filter=trending"
        />
        
        {/* Top Rated Section */}
        <MovieSection 
          title="Top Rated" 
          movies={topMovies || []} 
          isLoading={isLoadingTop}
          linkTo="/movies?filter=top-rated" 
        />
      </main>
      
      {/* Footer */}
      <footer className="bg-flixhive-dark py-8 text-center text-white/60">
        <div className="container mx-auto px-4">
          <p>© 2024 FlixHive - AI-Powered Movie Reviews and Recommendations</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
