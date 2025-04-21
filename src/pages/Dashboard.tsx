
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/navbar';
import FeaturedMovie from '@/components/FeaturedMovie';
import { Skeleton } from '@/components/ui/skeleton';
import { getTopMovies, getTrendingMovies } from '@/services/movieService';
import { Movie } from '@/types/movie';
import AIReviewSection from '@/components/AIReviewSection';
import SearchSection from '@/components/dashboard/SearchSection';
import TrendingSection from '@/components/dashboard/TrendingSection';
import TopRatedSection from '@/components/dashboard/TopRatedSection';

const Dashboard = () => {
  const [searchedMovie, setSearchedMovie] = useState<Movie | null>(null);
  const [netflixTrending, setNetflixTrending] = useState<Movie[]>([]);
  const [primeTrending, setPrimeTrending] = useState<Movie[]>([]);
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);

  const { data: topMovies, isLoading: isLoadingTop } = useQuery({
    queryKey: ['topMovies'],
    queryFn: getTopMovies,
  });

  const { data: trendingMovies, isLoading: isLoadingTrending } = useQuery({
    queryKey: ['trendingMovies'],
    queryFn: getTrendingMovies,
  });
  
  useEffect(() => {
    if (trendingMovies && trendingMovies.length > 0) {
      const netflix = trendingMovies
        .filter(movie => movie.platforms.some(p => p.toLowerCase().includes('netflix')))
        .slice(0, 10);
      
      const prime = trendingMovies
        .filter(movie => movie.platforms.some(p => p.toLowerCase().includes('prime')))
        .slice(0, 10);
      
      setNetflixTrending(netflix);
      setPrimeTrending(prime);
      
      const randomIndex = Math.floor(Math.random() * Math.min(3, trendingMovies.length));
      setFeaturedMovie(trendingMovies[randomIndex]);
    }
  }, [trendingMovies]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-900 to-indigo-900">
      <Navbar />
      
      <main className="container mx-auto px-4 pb-12">
        <SearchSection onMovieFound={setSearchedMovie} />

        {searchedMovie && (
          <div className="mb-10">
            <AIReviewSection movie={searchedMovie} />
          </div>
        )}
        
        {isLoadingTop || !featuredMovie ? (
          <div className="mt-6">
            <Skeleton className="w-full h-[60vh] md:h-[70vh] rounded-lg" />
          </div>
        ) : (
          <div className="mt-6">
            <FeaturedMovie movie={featuredMovie} />
          </div>
        )}
        
        <TrendingSection 
          netflixTrending={netflixTrending}
          primeTrending={primeTrending}
          isLoading={isLoadingTrending}
        />
        
        <TopRatedSection 
          movies={topMovies || []}
          isLoading={isLoadingTop}
        />
      </main>
      
      <footer className="bg-indigo-950 py-8 text-center text-white/60">
        <div className="container mx-auto px-4">
          <p>© 2024 FlixHive - AI-Powered Movie Reviews and Recommendations</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
