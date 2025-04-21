
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { SearchSection } from '@/components/SearchSection';
import AIReviewSection from '@/components/AIReviewSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { HeroSection } from '@/components/landing/HeroSection';
import { BackgroundElements } from '@/components/landing/BackgroundElements';
import type { Movie } from '@/types/movie';

const Landing = () => {
  const { isSignedIn } = useAuth();
  const [searchedMovie, setSearchedMovie] = useState<Movie | null>(null);

  if (isSignedIn) {
    return <Navigate to="/home" replace />;
  }

  const handleMovieSearch = async (movie: Movie | null) => {
    setSearchedMovie(movie);
    // Scroll to review section smoothly
    const reviewSection = document.getElementById('review-section');
    if (reviewSection) {
      reviewSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-800 to-indigo-900 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center relative overflow-hidden">
        <BackgroundElements />
        
        <HeroSection />
        
        {/* Search and Review Section */}
        <div className="w-full max-w-2xl mx-auto mt-8 mb-12">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Get AI-Powered Movie Reviews
            </h2>
            <p className="text-white/80">
              Search for any movie to get instant, in-depth AI analysis and reviews
            </p>
          </div>
          <SearchSection onMovieFound={handleMovieSearch} />
        </div>
        
        {searchedMovie && (
          <div id="review-section" className="w-full max-w-4xl mx-auto mt-8 px-4">
            <AIReviewSection movie={searchedMovie} />
          </div>
        )}
      </div>
      
      <FeaturesSection />
      
      {/* Footer */}
      <footer className="py-6 bg-indigo-950 text-center text-white/60">
        <p>© 2025 <a href="https://www.flixhive.in" className="hover:text-amber-400 transition-colors">www.flixhive.in</a> - PineGrass Tech</p>
      </footer>
    </div>
  );
};

export default Landing;
