
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FeaturedMovie from '@/components/FeaturedMovie';
import MovieSection from '@/components/MovieSection';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import TestAuthPanel from '@/components/auth/TestAuthPanel';
import { Movie } from '@/types/movie';
import { getTopMovies, getTrendingMovies } from '@/services/movieService';

export default function HomePage() {
  const { isSignedIn } = useAuth();
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        // Fetch trending movies
        const trending = await getTrendingMovies();
        setTrendingMovies(trending);
        
        // Set the first trending movie as the featured movie
        if (trending.length > 0) {
          setFeaturedMovie(trending[0]);
        }
        
        // Fetch top rated movies
        const topRated = await getTopMovies();
        setTopRatedMovies(topRated);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMovies();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        {!isSignedIn && (
          <div className="bg-flixhive-dark p-6 rounded-lg shadow-lg mb-6">
            <TestAuthPanel />
          </div>
        )}
        {featuredMovie && <FeaturedMovie movie={featuredMovie} />}
      </div>
      
      <div className="space-y-12">
        <MovieSection 
          title="Trending Movies" 
          movies={trendingMovies} 
          linkTo="/trending"
          isLoading={isLoading} 
        />
        
        <MovieSection 
          title="Top Rated Movies" 
          movies={topRatedMovies} 
          linkTo="/movies"
          isLoading={isLoading} 
        />
        
        <div className="text-center mt-8">
          <Link to="/movies">
            <Button size="lg" className="bg-flixhive-accent hover:bg-flixhive-accent/90">
              Browse All Movies
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
