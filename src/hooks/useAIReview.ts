
import { useState, useEffect } from 'react';
import { Movie } from '@/types/movie';
import { getAIReview } from '@/services/movieService';
import { useToast } from '@/components/ui/use-toast';
import { areApiKeysConfigured } from '@/config/api';
import { API_CONFIG } from '@/config/api';

export const useAIReview = (movie: Movie) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [aiReview, setAiReview] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMockReview, setIsMockReview] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [apiKeyState, setApiKeyState] = useState({
    configured: false,
    openRouter: ''
  });

  // Check API configuration on mount
  useEffect(() => {
    const openRouterKey = API_CONFIG.openrouter.apiKey || '';
    const configured = areApiKeysConfigured();
    
    console.log("OpenRouter API Key validation:", {
      keyExists: !!openRouterKey,
      keyLength: openRouterKey?.length,
      configured
    });
    
    setApiKeyState({
      configured,
      openRouter: openRouterKey || ''
    });
  }, []);

  const fetchAIReview = async (forceRefresh = false) => {
    if (!movie || !movie.id) {
      console.error("Cannot fetch AI review for invalid movie", movie);
      setIsLoading(false);
      setHasError(true);
      return;
    }
    
    setIsLoading(true);
    setIsGenerating(movie.id > 1000 || forceRefresh);
    setIsMockReview(false);
    setHasError(false);
    
    try {
      // Check if API key is configured
      const apiConfigured = areApiKeysConfigured();
      console.log("API keys configured:", apiConfigured);
      console.log("API Key length:", API_CONFIG.openrouter.apiKey?.length);
      
      // If no API key is set, we know we'll get a mock review
      if (!apiConfigured) {
        setIsMockReview(true);
        console.log("Setting to mock review due to missing or invalid OpenRouter API key");
      }
      
      // Check if it's a newly discovered movie (ID > 1000) or forced refresh
      if (movie.id > 1000 || forceRefresh) {
        setIsGenerating(true);
        toast({
          title: "Generating AI Review",
          description: `Creating a fresh review for "${movie.title}" using AI...`,
          duration: 5000,
        });
      }
      
      console.log("Calling getAIReview for movie:", movie.title, "with ID:", movie.id);
      const reviewData = await getAIReview(movie.id, forceRefresh);
      console.log("Review data received:", reviewData ? "Success" : "Failed");
      setAiReview(reviewData);
      
      // Check if this is a mock review by examining content
      if (
        !apiConfigured || 
        (reviewData.summary && (
          reviewData.summary.includes("mock review") || 
          reviewData.summary.includes("API key") ||
          reviewData.summary.includes("API credentials")
        ))
      ) {
        setIsMockReview(true);
        console.log("Using mock review data");
        if (!apiConfigured) {
          toast({
            title: "API Key Issue",
            description: `Using mock review data. Add OpenRouter API key in Netlify environment variables.`,
            variant: "destructive",
            duration: 5000,
          });
        }
      } else if (reviewData.summary && (
        reviewData.summary.includes("couldn't generate") ||
        reviewData.summary.includes("couldn't complete")
      )) {
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
          description: `We've created a detailed review for "${movie.title}" with AI`,
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
    if (movie && movie.id) {
      fetchAIReview();
    }
  }, [movie]);

  return {
    isLoading,
    aiReview,
    isGenerating,
    isMockReview,
    hasError,
    apiKeyConfigured: apiKeyState.configured,
    refreshReview: () => fetchAIReview(true)
  };
};
