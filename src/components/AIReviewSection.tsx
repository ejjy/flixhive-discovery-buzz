
import React, { useState, useEffect } from 'react';
import { Movie } from '@/types/movie';
import { getAIReview } from '@/services/movieService';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, BookOpen, Star, Film, MessageSquare, Loader2, AlertTriangle, Globe, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface AIReviewSectionProps {
  movie: Movie;
}

const AIReviewSection: React.FC<AIReviewSectionProps> = ({ movie }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [aiReview, setAiReview] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMockReview, setIsMockReview] = useState(false);
  const [hasError, setHasError] = useState(false);

  const fetchAIReview = async (forceRefresh = false) => {
    setIsLoading(true);
    setIsGenerating(movie.id > 1000 || forceRefresh);
    setIsMockReview(false);
    setHasError(false);
    
    try {
      // Check if it's a newly discovered movie (ID > 1000) or forced refresh
      if (movie.id > 1000 || forceRefresh) {
        setIsGenerating(true);
        toast({
          title: "Generating AI Review",
          description: `Creating a fresh review for "${movie.title}" using data from Wikipedia, IMDb, and Rotten Tomatoes...`,
          duration: 5000,
        });
      }
      
      // Fixed here: getAIReview should only take one parameter
      const reviewData = await getAIReview(movie.id);
      setAiReview(reviewData);
      
      // Check if this is a mock review
      if (reviewData.summary && (
          reviewData.summary.includes("mock review") || 
          reviewData.summary.includes("API key is not configured") ||
          reviewData.summary.includes("API key not set")
        )) {
        setIsMockReview(true);
        toast({
          title: "API Key Missing",
          description: "Using mock review data. Add OpenAI API key in Netlify for real AI reviews.",
          variant: "destructive",
          duration: 5000,
        });
      } else if (reviewData.summary && reviewData.summary.includes("couldn't generate")) {
        setHasError(true);
        toast({
          title: "Review Generation Issue",
          description: "We couldn't generate a complete review. You can try refreshing.",
          variant: "destructive",
          duration: 5000,
        });
      } else if (movie.id > 1000 || forceRefresh) {
        toast({
          title: "AI Review Ready",
          description: `We've created a detailed review for "${movie.title}" based on data from multiple sources`,
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error fetching AI review:', error);
      setHasError(true);
      toast({
        title: "Error",
        description: "Couldn't generate an AI review at this time",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (movie) {
      fetchAIReview();
    }
  }, [movie]);

  const handleRefresh = () => {
    fetchAIReview(true);
  };

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
          <p className="text-white/60 mb-6">We couldn't find an AI-generated review for this movie.</p>
          <Button onClick={handleRefresh} className="bg-flixhive-accent hover:bg-flixhive-accent/90">
            <RefreshCw className="mr-2 h-4 w-4" /> Generate Review
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Film className="h-8 w-8 text-flixhive-accent" />
        <h2 className="text-2xl font-bold">{movie.title} - AI Review</h2>
        {isGenerating && (
          <div className="ml-auto flex items-center gap-2 text-flixhive-accent animate-pulse">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Generating review...</span>
          </div>
        )}
        {isMockReview && (
          <div className="ml-auto flex items-center gap-2 text-yellow-500">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">Mock Review (API key not set)</span>
          </div>
        )}
        {hasError && (
          <div className="ml-auto flex items-center gap-2 text-red-500">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">Review Generation Issue</span>
          </div>
        )}
        {!isGenerating && (
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            size="sm" 
            className="ml-auto"
            disabled={isGenerating}
          >
            <RefreshCw className="h-4 w-4 mr-1" /> Refresh
          </Button>
        )}
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
              {!isMockReview && !hasError && (
                <div className="flex items-center mt-2 text-xs text-flixhive-accent">
                  <Globe className="h-3 w-3 mr-1" />
                  <span>Review based on data from Wikipedia, IMDb, and Rotten Tomatoes</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-3">
              <h4 className="text-lg font-medium flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                Pros
              </h4>
              <ul className="space-y-2">
                {aiReview.pros && aiReview.pros.map((pro: string, index: number) => (
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
                {aiReview.cons && aiReview.cons.map((con: string, index: number) => (
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
            {isMockReview ? (
              <span>This is a mock review. Configure OpenAI API key in Netlify for real AI reviews.</span>
            ) : hasError ? (
              <span>Generated with limited information. Try refreshing for a better review.</span>
            ) : movie.id > 1000 ? (
              <span>AI-generated review created by analyzing online sources for this movie</span>
            ) : (
              <span>AI-generated from multiple credible sources including IMDb, Rotten Tomatoes, and Wikipedia</span>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AIReviewSection;
