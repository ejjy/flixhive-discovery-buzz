
import React from 'react';
import { Movie } from '@/types/movie';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PlusCircle, MinusCircle } from 'lucide-react';

interface MoviePosterProps {
  movie: Movie;
  isSaved: boolean;
  onToggleSave: () => void;
}

const MoviePoster: React.FC<MoviePosterProps> = ({ movie, isSaved, onToggleSave }) => {
  return (
    <div className="md:w-1/3 lg:w-1/4 flex-shrink-0">
      <img
        src={movie.posterPath}
        alt={movie.title}
        className="w-full rounded-lg shadow-2xl"
      />
      
      <div className="mt-6 space-y-4">
        <Button 
          className={`w-full ${
            isSaved 
              ? 'bg-flixhive-accent hover:bg-flixhive-accent/90' 
              : 'bg-flixhive-primary hover:bg-flixhive-primary/90'
          }`}
          onClick={onToggleSave}
        >
          {isSaved ? (
            <>
              <MinusCircle className="mr-2 h-4 w-4" /> Remove from Watchlist
            </>
          ) : (
            <>
              <PlusCircle className="mr-2 h-4 w-4" /> Add to Watchlist
            </>
          )}
        </Button>
        
        {movie.platformRatings && movie.platformRatings.length > 0 && (
          <div className="bg-flixhive-gray/30 rounded-lg p-4 mt-4">
            <h3 className="font-medium mb-3">Ratings Across Platforms:</h3>
            <div className="space-y-3">
              {movie.platformRatings.map((rating, index) => (
                <div key={index} className="flex flex-col">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">{rating.platform}</span>
                    <span className="text-sm font-medium">
                      {rating.score}/{rating.outOf}
                    </span>
                  </div>
                  <Progress 
                    value={(rating.score / rating.outOf) * 100} 
                    className="h-2"
                    indicatorClassName={
                      rating.score / rating.outOf >= 0.75
                        ? 'bg-green-500'
                        : rating.score / rating.outOf >= 0.6
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        
        {movie.platforms && movie.platforms.length > 0 && (
          <div className="bg-flixhive-gray/30 rounded-lg p-4">
            <h3 className="font-medium mb-2">Available on:</h3>
            <div className="flex flex-wrap gap-2">
              {movie.platforms.map((platform, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="bg-flixhive-gray/50 text-white border-white/10"
                >
                  {platform}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoviePoster;
