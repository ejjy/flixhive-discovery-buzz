
import React, { useState, useEffect } from 'react';
import { Movie } from '@/types/movie';
import { getAIReview } from '@/services/movieService';
import { useToast } from '@/components/ui/use-toast';
import AIReviewSkeleton from './ai-review/AIReviewSkeleton';
import AIReviewEmpty from './ai-review/AIReviewEmpty';
import AIReviewHeader from './ai-review/AIReviewHeader';
import AIReviewContent from './ai-review/AIReviewContent';

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
    return <AIReviewSkeleton />;
  }

  if (!aiReview) {
    return <AIReviewEmpty onRefresh={handleRefresh} />;
  }

  return (
    <div className="space-y-6">
      <AIReviewHeader 
        title={movie.title}
        isGenerating={isGenerating}
        isMockReview={isMockReview}
        hasError={hasError}
        onRefresh={handleRefresh}
      />

      <AIReviewContent 
        movie={movie}
        aiReview={aiReview}
        isMockReview={isMockReview}
        hasError={hasError}
      />
    </div>
  );
};

export default AIReviewSection;
