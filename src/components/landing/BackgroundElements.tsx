
import React from 'react';
import { Film, Tv, Star, Clapperboard } from 'lucide-react';

export const BackgroundElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-20">
      <div className="absolute -rotate-12 left-1/4 top-1/4">
        <Film className="h-32 w-32 text-amber-300" />
      </div>
      <div className="absolute rotate-12 right-1/4 top-1/3">
        <Clapperboard className="h-40 w-40 text-amber-300" />
      </div>
      <div className="absolute -rotate-6 left-1/3 bottom-1/4">
        <Star className="h-20 w-20 text-amber-300" />
      </div>
      <div className="absolute rotate-12 right-1/3 bottom-1/3">
        <Tv className="h-24 w-24 text-amber-300" />
      </div>
      <div className="absolute -rotate-12 left-2/3 top-1/2">
        <Film className="h-36 w-36 text-amber-300" />
      </div>
    </div>
  );
};
