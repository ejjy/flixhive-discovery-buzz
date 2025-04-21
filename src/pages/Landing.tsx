
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { HeroSection } from '@/components/landing/HeroSection';
import { BackgroundElements } from '@/components/landing/BackgroundElements';
import { FeaturesSection } from '@/components/landing/FeaturesSection';

const Landing = () => {
  const { isSignedIn } = useAuth();

  if (isSignedIn) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-800 to-indigo-900 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center relative overflow-hidden">
        <BackgroundElements />
        
        <HeroSection />
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
