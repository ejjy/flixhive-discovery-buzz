
import React from 'react';
import { Film } from 'lucide-react';

export const HeroSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl w-full">
      <div className="flex flex-col justify-center">
        <div className="mb-8 flex items-center justify-center md:justify-start relative z-10">
          <Film className="h-12 w-12 text-amber-400 mr-2" />
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            Flix<span className="text-amber-400">Hive</span>
          </h1>
        </div>
        
        <h2 className="text-xl md:text-2xl text-white/90 mb-6 max-w-2xl relative z-10 text-center md:text-left">
          Find out what to watch, with the best reviews and ratings
        </h2>
      </div>
    </div>
  );
};
