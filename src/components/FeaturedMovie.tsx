
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, PlayCircle } from 'lucide-react';
import { Movie } from '@/types/movie';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface FeaturedMovieProps {
  movie: Movie;
}

const FeaturedMovie: React.FC<FeaturedMovieProps> = ({ movie }) => {
  return (
    <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden rounded-lg">
      <div className="absolute inset-0">
        <img
          src={movie.backdropPath}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 flex flex-col md:flex-row items-start md:items-end">
        <div className="hidden md:block mr-6 mb-4">
          <img
            src={movie.posterPath}
            alt={movie.title}
            className="w-48 h-auto rounded-md shadow-lg"
          />
        </div>
        
        <div className="flex-1">
          <div className="flex flex-wrap gap-2 mb-3">
            {movie.genres.map((genre, index) => (
              <Badge key={index} className="bg-flixhive-primary/80 hover:bg-flixhive-primary">
                {genre}
              </Badge>
            ))}
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">{movie.title}</h1>
          
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center">
              <Star className="rating-star w-5 h-5 mr-1" fill="currentColor" />
              <span className="font-medium">{movie.voteAverage.toFixed(1)}</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Clock className="w-4 h-4 mr-1" />
              <span>{movie.runtime} min</span>
            </div>
            <span className="text-gray-300">
              {new Date(movie.releaseDate).getFullYear()}
            </span>
          </div>
          
          <p className="text-gray-300 mb-6 max-w-2xl line-clamp-3 md:line-clamp-4">
            {movie.overview}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to={`/movie/${movie.id}`}>
              <Button className="bg-flixhive-accent hover:bg-flixhive-accent/90 w-full sm:w-auto">
                <PlayCircle className="mr-2 h-4 w-4" /> Watch Details
              </Button>
            </Link>
            <Link to={`/movie/${movie.id}#ai-review`}>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 w-full sm:w-auto">
                View AI Review
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedMovie;
