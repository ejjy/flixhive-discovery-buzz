
import React from 'react';
import { Movie } from '@/types/movie';
import { Star, CalendarDays, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MovieHeaderProps {
  movie: Movie;
}

const MovieHeader: React.FC<MovieHeaderProps> = ({ movie }) => {
  return (
    <>
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
        {movie.title}
      </h1>
      
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6">
        <div className="flex items-center">
          <Star className="rating-star w-5 h-5 mr-1" fill="currentColor" />
          <span className="font-medium">{movie.voteAverage.toFixed(1)}</span>
        </div>
        
        <div className="flex items-center text-gray-400">
          <CalendarDays className="w-4 h-4 mr-1" />
          <span>{new Date(movie.releaseDate).getFullYear()}</span>
        </div>
        
        {movie.runtime && (
          <div className="flex items-center text-gray-400">
            <Clock className="w-4 h-4 mr-1" />
            <span>{movie.runtime} min</span>
          </div>
        )}
        
        <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
          {movie.genres.map((genre, index) => (
            <Badge key={index} variant="outline" className="bg-flixhive-primary/20 border-flixhive-primary/30 text-white">
              {genre}
            </Badge>
          ))}
        </div>
      </div>
    </>
  );
};

export default MovieHeader;
