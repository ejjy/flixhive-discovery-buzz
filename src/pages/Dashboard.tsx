
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import FeaturedMovie from '@/components/FeaturedMovie';
import MovieSection from '@/components/MovieSection';
import { Skeleton } from '@/components/ui/skeleton';
import { getTopMovies, getTrendingMovies, searchMovies } from '@/services/movieService';
import { Movie } from '@/types/movie';
import { UserButton } from '@clerk/clerk-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import AIReviewSection from '@/components/AIReviewSection';

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedMovie, setSearchedMovie] = useState<Movie | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const { data: topMovies, isLoading: isLoadingTop } = useQuery({
    queryKey: ['topMovies'],
    queryFn: getTopMovies,
  });

  const { data: trendingMovies, isLoading: isLoadingTrending } = useQuery({
    queryKey: ['trendingMovies'],
    queryFn: getTrendingMovies,
  });

  const [featuredMovie, setFeaturedMovie] = React.useState<Movie | null>(null);
  
  React.useEffect(() => {
    if (topMovies && topMovies.length > 0) {
      // Select a random movie from the top movies as the featured one
      const randomIndex = Math.floor(Math.random() * Math.min(3, topMovies.length));
      setFeaturedMovie(topMovies[randomIndex]);
    }
  }, [topMovies]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      try {
        const results = await searchMovies(searchQuery);
        if (results && results.length > 0) {
          setSearchedMovie(results[0]);
        } else {
          setSearchedMovie(null);
        }
      } catch (error) {
        console.error('Error searching movies:', error);
      } finally {
        setIsSearching(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-flixhive-dark to-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pb-12">
        {/* Hero Search Section */}
        <div className="mt-6 mb-10 p-6 rounded-lg bg-flixhive-gray/30 border border-white/10">
          <h2 className="text-2xl font-bold mb-4 text-white">Search for AI-Generated Movie Reviews</h2>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter a movie title..."
              className="flex-1 bg-flixhive-gray/50 border-flixhive-gray/30 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button 
              type="submit" 
              className="bg-flixhive-accent hover:bg-flixhive-accent/90"
              disabled={isSearching}
            >
              <Search className="mr-2 h-4 w-4" />
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </form>
        </div>

        {/* AI Review Section */}
        {searchedMovie && (
          <div className="mb-10">
            <AIReviewSection movie={searchedMovie} />
          </div>
        )}
        
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

export default Dashboard;
