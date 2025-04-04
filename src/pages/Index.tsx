
import React from 'react';
import { Link } from 'react-router-dom';
import FeaturedMovie from '@/components/FeaturedMovie';
import MovieSection from '@/components/MovieSection';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import TestAuthPanel from '@/components/auth/TestAuthPanel';

export default function HomePage() {
  const { isSignedIn } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        {!isSignedIn && (
          <div className="bg-flixhive-dark p-6 rounded-lg shadow-lg mb-6">
            <TestAuthPanel />
          </div>
        )}
        <FeaturedMovie />
      </div>
      
      <div className="space-y-12">
        <MovieSection title="Trending Movies" type="trending" />
        <MovieSection title="Top Rated Movies" type="top_rated" />
        
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
