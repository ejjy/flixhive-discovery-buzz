
import React, { useState, useEffect } from 'react';
import { Movie } from '@/types/movie';
import { getAIReview } from '@/services/movieService';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Check, X, BookOpen, Star, Film, MessageSquare } from 'lucide-react';

interface AIReviewSectionProps {
  movie: Movie;
}

const AIReviewSection: React.FC<AIReviewSectionProps> = ({ movie }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [aiReview, setAiReview] = useState<any>(null);

  useEffect(() => {
    const fetchAIReview = async () => {
      setIsLoading(true);
      try {
        const reviewData = await getAIReview(movie.id);
        setAiReview(reviewData);
      } catch (error) {
        console.error('Error fetching AI review:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (movie) {
      fetchAIReview();
    }
  }, [movie]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  if (!aiReview) {
    return (
      <Card className="p-6 bg-flixhive-gray/30 border border-white/10">
        <div className="text-center py-8">
          <MessageSquare className="h-16 w-16 mx-auto mb-4 text-flixhive-accent opacity-50" />
          <h3 className="text-2xl font-semibold mb-2">No AI Review Available</h3>
          <p className="text-white/60">We couldn't find an AI-generated review for this movie.</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Film className="h-8 w-8 text-flixhive-accent" />
        <h2 className="text-2xl font-bold">{movie.title} - AI Review</h2>
      </div>

      <Card className="p-6 bg-flixhive-gray/30 border border-white/10">
        <div className="space-y-4">
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
              <p className="text-white/80">{aiReview.summary}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-3">
              <h4 className="text-lg font-medium flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                Pros
              </h4>
              <ul className="space-y-2">
                {aiReview.pros.map((pro: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    <span className="text-white/80">{pro}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-lg font-medium flex items-center gap-2">
                <X className="h-5 w-5 text-red-500" />
                Cons
              </h4>
              <ul className="space-y-2">
                {aiReview.cons.map((con: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <X className="h-4 w-4 text-red-500 mt-1 shrink-0" />
                    <span className="text-white/80">{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10">
            <h4 className="text-lg font-medium flex items-center gap-2 mb-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Recommendation
            </h4>
            <p className="text-white/80 italic">{aiReview.watchRecommendation}</p>
          </div>

          <div className="mt-4 text-xs text-white/40 flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            <span>AI-generated from multiple sources including reviews, ratings, and analysis</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AIReviewSection;
