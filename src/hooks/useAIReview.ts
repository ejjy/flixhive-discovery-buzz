
import { useState, useEffect } from 'react';
import { Movie } from '@/types/movie';
import { getAIReview } from '@/services/movieService';
import { useToast } from '@/components/ui/use-toast';
import { areApiKeysConfigured } from '@/config/api';

export const useAIReview = (movie: Movie) => {
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
      // Check if API keys are configured
      const apiKeysSet = areApiKeysConfigured();
      
      // If no API keys are set, we know we'll get a mock review
      if (!apiKeysSet) {
        setIsMockReview(true);
      }
      
      // Check if it's a newly discovered movie (ID > 1000) or forced refresh
      if (movie.id > 1000 || forceRefresh) {
        setIsGenerating(true);
        toast({
          title: "Generating AI Review",
          description: `Creating a fresh review for "${movie.title}" using data from Wikipedia, IMDb, and Rotten Tomatoes...`,
          duration: 5000,
        });
      }
      
      const reviewData = await getAIReview(movie.id, forceRefresh);
      setAiReview(reviewData);
      
      // Check if this is a mock review by examining content
      if (
        !apiKeysSet || 
        (reviewData.summary && (
          reviewData.summary.includes("mock review") || 
          reviewData.summary.includes("API key is not configured") ||
          reviewData.summary.includes("API key not set") ||
          reviewData.summary.includes("API keys are not configured")
        ))
      ) {
        setIsMockReview(true);
        console.log("Using mock review data - API keys not properly configured");
        toast({
          title: "API Key Missing",
          description: "Using mock review data. Add Gemini or Perplexity API key in Netlify for real AI reviews.",
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

  return {
    isLoading,
    aiReview,
    isGenerating,
    isMockReview,
    hasError,
    refreshReview: () => fetchAIReview(true)
  };
};
