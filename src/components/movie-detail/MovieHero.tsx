
import React from 'react';
import { Movie } from '@/types/movie';

interface MovieHeroProps {
  movie: Movie;
}

const MovieHero: React.FC<MovieHeroProps> = ({ movie }) => {
  return (
    <div className="relative w-full h-[50vh] lg:h-[60vh]">
      <div className="absolute inset-0">
        <img
          src={movie.backdropPath}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-black/50"></div>
      </div>
    </div>
  );
};

export default MovieHero;
