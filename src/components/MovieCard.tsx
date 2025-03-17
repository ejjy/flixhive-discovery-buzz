
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock } from 'lucide-react';
import { Movie } from '@/types/movie';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface MovieCardProps {
  movie: Movie;
  className?: string;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, className }) => {
  return (
    <Link to={`/movie/${movie.id}`} className={cn("movie-card", className)}>
      <div className="aspect-[2/3] w-full">
        <img 
          src={movie.posterPath} 
          alt={movie.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="movie-card-overlay"></div>
        <div className="movie-card-content">
          <h3 className="font-bold text-lg md:text-xl line-clamp-1">{movie.title}</h3>
          <div className="flex items-center space-x-2 mt-1">
            <div className="flex items-center">
              <Star className="rating-star w-4 h-4 mr-1" fill="currentColor" />
              <span className="text-sm">{movie.voteAverage.toFixed(1)}</span>
            </div>
            <span className="text-xs text-gray-300">
              {new Date(movie.releaseDate).getFullYear()}
            </span>
          </div>
          {movie.genres && (
            <div className="mt-2 flex flex-wrap gap-1">
              {movie.genres.slice(0, 2).map((genre, index) => (
                <Badge key={index} variant="outline" className="text-[10px] bg-black/50 text-white border-white/20">
                  {genre}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
