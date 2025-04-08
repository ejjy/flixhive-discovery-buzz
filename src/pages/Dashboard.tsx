
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/navbar';
import FeaturedMovie from '@/components/FeaturedMovie';
import MovieSection from '@/components/MovieSection';
import { Skeleton } from '@/components/ui/skeleton';
import { getTopMovies, getTrendingMovies, searchMovies, getAIReview } from '@/services/movieService';
import { Movie } from '@/types/movie';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, TrendingUp, Star, Loader2 } from 'lucide-react';
import AIReviewSection from '@/components/AIReviewSection';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedMovie, setSearchedMovie] = useState<Movie | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const { toast } = useToast();

  const { data: topMovies, isLoading: isLoadingTop } = useQuery({
    queryKey: ['topMovies'],
    queryFn: getTopMovies,
  });

  const { data: trendingMovies, isLoading: isLoadingTrending } = useQuery({
    queryKey: ['trendingMovies'],
    queryFn: getTrendingMovies,
  });

  const [netflixTrending, setNetflixTrending] = useState<Movie[]>([]);
  const [primeTrending, setPrimeTrending] = useState<Movie[]>([]);
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  
  // Filter trending movies by platform
  useEffect(() => {
    if (trendingMovies && trendingMovies.length > 0) {
      // Filter for Netflix and Prime Video
      const netflix = trendingMovies
        .filter(movie => movie.platforms.some(p => p.toLowerCase().includes('netflix')))
        .slice(0, 10);
      
      const prime = trendingMovies
        .filter(movie => movie.platforms.some(p => p.toLowerCase().includes('prime')))
        .slice(0, 10);
      
      setNetflixTrending(netflix);
      setPrimeTrending(prime);
      
      // Select a random movie from the top movies as the featured one
      const randomIndex = Math.floor(Math.random() * Math.min(3, trendingMovies.length));
      setFeaturedMovie(trendingMovies[randomIndex]);
    }
  }, [trendingMovies]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      setSearchProgress(10);
      toast({
        title: "Searching for movie",
        description: `Looking for "${searchQuery}" in our database...`,
        duration: 3000,
      });
      
      try {
        // First progress update - searching
        setSearchProgress(30);
        const results = await searchMovies(searchQuery);
        setSearchProgress(60);
        
        if (results && results.length > 0) {
          const foundMovie = results[0];
          setSearchedMovie(foundMovie);
          
          // Check if this is a newly discovered movie (ID > 1000)
          const isNewDiscovery = foundMovie.id > 1000;
          if (isNewDiscovery) {
            toast({
              title: "New Movie Discovered",
              description: `"${foundMovie.title}" was not in our database. Generating AI review...`,
              duration: 4000,
            });
          } else {
            toast({
              title: "Movie Found",
              description: `Found "${foundMovie.title}" in our database.`,
              duration: 3000,
            });
          }
          
          // Pre-fetch the AI review for better UX - UPDATE: now passing full movie object
          setSearchProgress(80);
          await getAIReview(foundMovie, isNewDiscovery);
          setSearchProgress(100);
        } else {
          setSearchedMovie(null);
          toast({
            title: "No Results",
            description: "We couldn't find any movies matching your search.",
            variant: "destructive",
            duration: 3000,
          });
        }
      } catch (error) {
        console.error('Error searching movies:', error);
        toast({
          title: "Search Error",
          description: "An error occurred while searching for movies.",
          variant: "destructive",
          duration: 3000,
        });
      } finally {
        setIsSearching(false);
        // Reset progress after a delay
        setTimeout(() => setSearchProgress(0), 500);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-900 to-indigo-900">
      <Navbar />
      
      <main className="container mx-auto px-4 pb-12">
        {/* Hero Search Section */}
        <div className="mt-6 mb-10 p-6 rounded-lg bg-sky-800/50 border border-sky-700/30 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-white">Get a review for a movie you want</h2>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter a movie title..."
              className="flex-1 bg-sky-900/50 border-sky-700/30 text-white placeholder:text-sky-300/70"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={isSearching}
            />
            <Button 
              type="submit" 
              className="bg-amber-500 hover:bg-amber-600 text-white"
              disabled={isSearching}
            >
              {isSearching ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Searching...</>
              ) : (
                <><Search className="mr-2 h-4 w-4" /> Search</>
              )}
            </Button>
          </form>
          
          {/* Search Progress Bar */}
          {searchProgress > 0 && (
            <div className="mt-4">
              <Progress value={searchProgress} className="h-1" indicatorClassName="bg-amber-500" />
              <p className="text-xs text-sky-300 mt-1">
                {searchProgress < 40 ? "Searching movie databases..." : 
                 searchProgress < 70 ? "Processing movie information..." : 
                 "Generating AI review..."}
              </p>
            </div>
          )}
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
        
        {/* Netflix Trending Section */}
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-red-500" />
            <h2 className="text-xl font-bold text-white">Netflix Trending</h2>
            <Badge className="ml-2 bg-red-600">Top 10</Badge>
          </div>
          <MovieSection 
            title="" 
            movies={netflixTrending || []} 
            isLoading={isLoadingTrending} 
            linkTo="/trending?platform=netflix"
            showTitle={false}
          />
        </div>
        
        {/* Prime Video Trending Section */}
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Prime Video Trending</h2>
            <Badge className="ml-2 bg-blue-600">Top 10</Badge>
          </div>
          <MovieSection 
            title="" 
            movies={primeTrending || []} 
            isLoading={isLoadingTrending} 
            linkTo="/trending?platform=prime"
            showTitle={false}
          />
        </div>
        
        {/* Top Rated Section */}
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-yellow-400" />
            <h2 className="text-xl font-bold text-white">Top Rated Movies</h2>
          </div>
          <MovieSection 
            title="" 
            movies={topMovies || []} 
            isLoading={isLoadingTop}
            linkTo="/movies?filter=top-rated"
            showTitle={false}
          />
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-indigo-950 py-8 text-center text-white/60">
        <div className="container mx-auto px-4">
          <p>© 2024 FlixHive - AI-Powered Movie Reviews and Recommendations</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
