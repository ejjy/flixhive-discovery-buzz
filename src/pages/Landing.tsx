
import React from 'react';
import { Link } from 'react-router-dom';
import { Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SignInButton, SignUpButton, useAuth } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

const Landing = () => {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-flixhive-dark to-background flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <div className="mb-8 flex items-center">
          <Film className="h-12 w-12 text-flixhive-accent mr-2" />
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            Flix<span className="text-flixhive-accent">Hive</span>
          </h1>
        </div>
        
        <h2 className="text-xl md:text-2xl text-white/80 mb-6 max-w-2xl">
          AI-Powered Movie Reviews and Recommendations
        </h2>
        
        <p className="text-white/60 mb-12 max-w-xl">
          Discover new movies, get personalized recommendations, and join a community of movie enthusiasts.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <SignUpButton mode="modal">
            <Button size="lg" className="bg-flixhive-accent hover:bg-flixhive-accent/90">
              Get Started
            </Button>
          </SignUpButton>
          
          <SignInButton mode="modal">
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/5">
              Sign In
            </Button>
          </SignInButton>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-12 px-4 bg-black/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg bg-flixhive-gray/30 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-3">AI-Powered Reviews</h3>
              <p className="text-white/70">Get insightful movie reviews generated by our AI from trusted sources.</p>
            </div>
            
            <div className="p-6 rounded-lg bg-flixhive-gray/30 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-3">Personalized Recommendations</h3>
              <p className="text-white/70">Discover movies tailored to your preferences and viewing history.</p>
            </div>
            
            <div className="p-6 rounded-lg bg-flixhive-gray/30 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-3">Track Your Watchlist</h3>
              <p className="text-white/70">Save movies to watch later and keep track of what you've seen.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="py-6 bg-flixhive-dark text-center text-white/40">
        <p>© 2024 FlixHive - All rights reserved</p>
      </footer>
    </div>
  );
};

export default Landing;
