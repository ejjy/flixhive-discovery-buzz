
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/navbar';
import MovieCard from '@/components/MovieCard';
import { searchMovies } from '@/services/movieService';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
    searchQuery.toLowerCase().includes('with');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {isNaturalLanguageQuery ? 'Movie Suggestions' : 'Search Results'}
          </h1>
          <p className="text-gray-400">
            {isNaturalLanguageQuery 
              ? `Based on your description: `
              : `Results for: `}
            <span className="text-white font-medium">"{searchQuery}"</span>
          </p>
          
          {/* Quick search form */}
          <form onSubmit={handleSearch} className="mt-6 mb-8 flex gap-2">
            <Input
              type="text"
              placeholder="Refine your search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-sky-900/20 border-sky-700/30"
            />
            <Button type="submit" className="bg-amber-500 hover:bg-amber-600">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </form>
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
              <MovieCard key={movie.id} movie={movie} />
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
