
import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Movie } from '@/types/movie';
import { Badge } from '@/components/ui/badge';
import MovieSection from '@/components/MovieSection';

interface TrendingSectionProps {
  netflixTrending: Movie[];
  primeTrending: Movie[];
  isLoading: boolean;
}

const TrendingSection: React.FC<TrendingSectionProps> = ({
  netflixTrending,
  primeTrending,
  isLoading,
}) => {
  return (
    <>
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-red-500" />
          <h2 className="text-xl font-bold text-white">Netflix Trending</h2>
          <Badge className="ml-2 bg-red-600">Top 10</Badge>
        </div>
        <MovieSection 
          title="" 
          movies={netflixTrending} 
          isLoading={isLoading} 
          linkTo="/trending?platform=netflix"
          showTitle={false}
        />
      </div>
      
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          <h2 className="text-xl font-bold text-white">Prime Video Trending</h2>
          <Badge className="ml-2 bg-blue-600">Top 10</Badge>
        </div>
        <MovieSection 
          title="" 
          movies={primeTrending} 
          isLoading={isLoading} 
          linkTo="/trending?platform=prime"
          showTitle={false}
        />
      </div>
    </>
  );
};

export default TrendingSection;
