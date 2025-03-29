
import React from 'react';
import { Link } from 'react-router-dom';
import { Movie } from '@/types/movie';
import MovieCard from '@/components/MovieCard';
import { ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface MovieSectionProps {
  title: string;
  movies: Movie[];
  linkTo?: string;
  isLoading?: boolean;
  showTitle?: boolean;  // Added showTitle prop which defaults to true
}

const MovieSection: React.FC<MovieSectionProps> = ({ 
  title, 
  movies, 
  linkTo,
  isLoading = false,
  showTitle = true  // Default value set to true for backward compatibility
}) => {
  return (
    <div className="py-8">
      {showTitle && (
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{title}</h2>
          {linkTo && (
            <Link 
              to={linkTo} 
              className="text-flixhive-accent hover:text-flixhive-light flex items-center transition-colors"
            >
              See All <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {isLoading ? (
          // Skeleton loading state
          Array(5).fill(0).map((_, index) => (
            <div key={index} className="movie-card">
              <Skeleton className="aspect-[2/3] w-full" />
            </div>
          ))
        ) : (
          // Loaded content
          movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))
        )}
      </div>
    </div>
  );
};

export default MovieSection;
