
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import MovieCard from '@/components/MovieCard';
import { getTopMovies } from '@/services/movieService';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Movie } from '@/types/movie';

const Movies = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const filterParam = queryParams.get('filter') || 'all';
  const [activeTab, setActiveTab] = useState(filterParam);

  const { data: movies, isLoading } = useQuery({
    queryKey: ['allMovies'],
    queryFn: getTopMovies,
  });

  // Effect to handle URL parameter changes
  useEffect(() => {
    setActiveTab(filterParam);
  }, [filterParam]);

  // Filter movies based on active tab
  const getFilteredMovies = (): Movie[] => {
    if (!movies) return [];
    
    switch (activeTab) {
      case 'top-rated':
        return [...movies].sort((a, b) => b.voteAverage - a.voteAverage);
      case 'newest':
        return [...movies].sort((a, b) => 
          new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
        );
      case 'trending':
        // For demo purposes, we'll just shuffle the list
        return [...movies].sort(() => 0.5 - Math.random());
      default:
        return movies;
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/movies?filter=${value}`, { replace: true });
  };

  const filteredMovies = getFilteredMovies();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Discover Movies</h1>
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-8">
          <TabsList className="grid grid-cols-4 md:w-[600px]">
            <TabsTrigger value="all">All Movies</TabsTrigger>
            <TabsTrigger value="top-rated">Top Rated</TabsTrigger>
            <TabsTrigger value="newest">Newest</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {Array(10).fill(0).map((_, index) => (
              <Skeleton key={index} className="aspect-[2/3] w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Movies;
