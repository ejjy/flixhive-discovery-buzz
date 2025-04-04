
import { useState, useEffect } from 'react';
import { Movie } from '@/types/movie';
import { getAIReview } from '@/services/movieService';
import { useToast } from '@/components/ui/use-toast';
import { areApiKeysConfigured } from '@/config/api';
import { API_CONFIG } from '@/config/api';
import { isMoviePopulated } from '@/services/moviePopulationService'; 

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
    
    console.log("API key validation:", {
      openRouterKeyExists: !!openRouterKey,
      openRouterKeyLength: openRouterKey?.length || 0,
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
    
    // Determine if we need to generate a new review
    const isNewDiscovery = movie.id > 1000;
    const shouldGenerate = isNewDiscovery || forceRefresh;
    
    setIsGenerating(shouldGenerate);
    setIsMockReview(false);
    setHasError(false);
    
    try {
      // Check if API key is configured
      const apiConfigured = areApiKeysConfigured();
      console.log("API keys configured:", apiConfigured);
      
      // If no API key is set, we know we'll get a mock review
      if (!apiConfigured) {
        setIsMockReview(true);
        console.log("Will use mock review due to missing API key");
      }
      
      // Show appropriate toasts based on the context
      if (isNewDiscovery) {
        toast({
          title: "Generating AI Review",
          description: `Creating a new review for "${movie.title}"...`,
          duration: 5000,
        });
      } else if (forceRefresh) {
        toast({
          title: "Refreshing AI Review",
          description: `Creating a fresh review for "${movie.title}"...`,
          duration: 5000,
        });
      }
      
      console.log("Calling getAIReview for movie:", movie.title, "with ID:", movie.id);
      const reviewData = await getAIReview(movie.id, forceRefresh);
      console.log("Review data received:", reviewData);
      
      if (!reviewData) {
        throw new Error("Failed to get review data");
      }
      
      setAiReview(reviewData);
      
      // Check if this is a mock review
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
            title: "API Key Missing",
            description: `Using mock review data. Add OpenRouter API key in environment variables.`,
            variant: "destructive",
            duration: 5000,
          });
        }
      } else if (reviewData.error || (reviewData.summary && (
        reviewData.summary.includes("couldn't generate") ||
        reviewData.summary.includes("couldn't complete")
      ))) {
        setHasError(true);
        toast({
          title: "Review Generation Issue",
          description: "We couldn't generate a complete review. You can try refreshing.",
          variant: "destructive",
          duration: 5000,
        });
      } else if (isNewDiscovery || forceRefresh) {
        toast({
          title: "AI Review Ready",
          description: `We've created a review for "${movie.title}"`,
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
