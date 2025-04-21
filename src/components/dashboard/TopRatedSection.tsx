
import React from 'react';
import { Star } from 'lucide-react';
import { Movie } from '@/types/movie';
import MovieSection from '@/components/MovieSection';

interface TopRatedSectionProps {
  movies: Movie[];
  isLoading: boolean;
}

const TopRatedSection: React.FC<TopRatedSectionProps> = ({ movies, isLoading }) => {
  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-4">
        <Star className="w-5 h-5 text-yellow-400" />
        <h2 className="text-xl font-bold text-white">Top Rated Movies</h2>
      </div>
      <MovieSection 
        title="" 
        movies={movies} 
        isLoading={isLoading}
        linkTo="/movies?filter=top-rated"
        showTitle={false}
      />
    </div>
  );
};

export default TopRatedSection;
