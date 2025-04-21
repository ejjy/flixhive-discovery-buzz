
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/navbar';
import MovieCard from '@/components/MovieCard';
import { searchMovies } from '@/services/movieService';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, AlertCircle, Film, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('q') || '';
  const [query, setQuery] = useState(searchQuery);

  useEffect(() => {
    setQuery(searchQuery);
  }, [searchQuery]);

  const { data: results, isLoading } = useQuery({
    queryKey: ['searchResults', searchQuery],
    queryFn: () => searchMovies(searchQuery),
    enabled: searchQuery.length > 0,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  if (!searchQuery) {
    navigate('/');
    return null;
  }

  // Check if this is likely a natural language query
  const isNaturalLanguageQuery = searchQuery.split(' ').length > 2 || 
    searchQuery.toLowerCase().includes('movie') ||
    searchQuery.toLowerCase().includes('about') ||
    searchQuery.toLowerCase().includes('with') ||
    searchQuery.toLowerCase().includes('like') ||
    searchQuery.toLowerCase().includes('feel') ||
    searchQuery.toLowerCase().includes('want');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            {isNaturalLanguageQuery ? (
              <Sparkles className="h-8 w-8 text-amber-500" />
            ) : (
              <Search className="h-8 w-8 text-amber-500" />
            )}
            <h1 className="text-3xl font-bold">
              {isNaturalLanguageQuery ? 'Movie Suggestions' : 'Search Results'}
            </h1>
          </div>
          
          <div className="mt-3 flex items-center">
            <p className="text-gray-400">
              {isNaturalLanguageQuery 
                ? `Based on your wish: `
                : `Results for: `}
            </p>
            <Badge variant="outline" className="ml-2 bg-amber-500/10 text-amber-500 border-amber-500/20 px-3 py-1">
              <span className="text-white font-medium">"{searchQuery}"</span>
            </Badge>
          </div>
          
          {/* Quick search form */}
          <form onSubmit={handleSearch} className="mt-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Refine your search or describe what you feel like watching..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10 py-6 bg-sky-950/20 border-sky-800/30 text-white"
                />
              </div>
              <Button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white px-6">
                <Film className="w-4 h-4 mr-2" />
                Find Movies
              </Button>
            </div>
          </form>
          
          {isNaturalLanguageQuery && !isLoading && results && (
            <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-indigo-950/40 to-sky-950/40 border border-sky-900/30">
              <h2 className="text-lg font-medium mb-2 text-amber-400 flex items-center">
                <Sparkles className="w-4 h-4 mr-2" />
                We analyzed your search
              </h2>
              <p className="text-gray-300 mb-3">Our AI found movies that match what you're looking for based on:</p>
              <div className="flex flex-wrap gap-2">
                {results && results[0]?.genres.map((genre, index) => (
                  <Badge key={index} variant="secondary" className="bg-amber-900/30 text-amber-300 border-amber-800/50">
                    {genre}
                  </Badge>
                ))}
                {searchQuery.split(' ')
                  .filter(word => word.length > 3 && !['movie', 'about', 'with', 'like', 'want', 'something'].includes(word.toLowerCase()))
                  .slice(0, 3)
                  .map((keyword, index) => (
                    <Badge key={`kw-${index}`} variant="outline" className="bg-sky-900/20 text-sky-300 border-sky-800/40">
                      {keyword}
                    </Badge>
                  ))
                }
              </div>
            </div>
          )}
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {Array(6).fill(0).map((_, index) => (
              <Skeleton key={index} className="aspect-[2/3] w-full rounded-lg" />
            ))}
          </div>
        ) : results && results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {results.map((movie) => (
              <div key={movie.id} onClick={() => navigate(`/movie/${movie.id}`)}>
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">No results found</h2>
            <p className="text-muted-foreground mb-6">
              We couldn't find any movies matching your description.
            </p>
            <Button 
              className="bg-flixhive-primary hover:bg-flixhive-primary/90"
              onClick={() => navigate('/movies')}
            >
              Browse All Movies
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchResults;
