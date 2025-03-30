
import React from 'react';
import { Movie } from '@/types/movie';
import { Badge } from '@/components/ui/badge';
import { Globe } from 'lucide-react';

interface AIReviewSummaryProps {
  movie: Movie;
  summary: string;
  isMockReview: boolean;
  hasError: boolean;
}

const AIReviewSummary: React.FC<AIReviewSummaryProps> = ({
  movie,
  summary,
  isMockReview,
  hasError,
}) => {
  return (
    <div className="flex items-start gap-4">
      {movie.posterPath && (
        <img 
          src={movie.posterPath} 
          alt={movie.title} 
          className="w-24 h-36 object-cover rounded-md hidden sm:block" 
        />
      )}
      <div>
        <h3 className="text-xl font-semibold mb-2">{movie.title}</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {movie.genres.map((genre, index) => (
            <Badge key={index} variant="outline" className="bg-flixhive-gray/50">
              {genre}
            </Badge>
          ))}
        </div>
        <p className="text-white/80">{summary}</p>
        {!isMockReview && !hasError && (
          <div className="flex items-center mt-2 text-xs text-flixhive-accent">
            <Globe className="h-3 w-3 mr-1" />
            <span>Review based on data from Wikipedia, IMDb, and Rotten Tomatoes</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIReviewSummary;
