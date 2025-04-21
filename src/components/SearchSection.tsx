
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Search, Loader2 } from 'lucide-react';
import { Movie } from '@/types/movie';
import { useToast } from '@/components/ui/use-toast';
import { searchMovies, getAIReview } from '@/services/movieService';

interface SearchSectionProps {
  onMovieFound: (movie: Movie) => void;
}

export const SearchSection: React.FC<SearchSectionProps> = ({ onMovieFound }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState(0);
  const { toast } = useToast();

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
        setSearchProgress(30);
        const results = await searchMovies(searchQuery);
        setSearchProgress(60);
        
        if (results && results.length > 0) {
          const foundMovie = results[0];
          onMovieFound(foundMovie);
          
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
          
          setSearchProgress(80);
          await getAIReview(foundMovie, isNewDiscovery);
          setSearchProgress(100);
        } else {
          onMovieFound(null);
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
        setTimeout(() => setSearchProgress(0), 500);
      }
    }
  };

  return (
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
  );
};
