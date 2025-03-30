
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
    key: ''
  });

  // Check API configuration on mount
  useEffect(() => {
    const configured = areApiKeysConfigured();
    setApiKeyState({
      configured,
      key: API_CONFIG.gemini.apiKey || ''
    });
    
    if (!configured) {
      console.log("Gemini API key not properly configured:", 
                 API_CONFIG.gemini.apiKey ? 
                 `Key exists but may be invalid (length: ${API_CONFIG.gemini.apiKey.length})` : 
                 'Key not found');
    } else {
      console.log("Gemini API key is configured correctly");
    }
  }, []);

  const fetchAIReview = async (forceRefresh = false) => {
    setIsLoading(true);
    setIsGenerating(movie.id > 1000 || forceRefresh);
    setIsMockReview(false);
    setHasError(false);
    
    try {
      // Check if Gemini API key is configured
      const geminiApiConfigured = areApiKeysConfigured();
      console.log("API Keys configuration check result:", geminiApiConfigured);
      console.log("API Key length:", API_CONFIG.gemini.apiKey?.length || 0);
      
      // If no API key is set, we know we'll get a mock review
      if (!geminiApiConfigured) {
        setIsMockReview(true);
        console.log("Setting to mock review due to missing API key");
      }
      
      // Check if it's a newly discovered movie (ID > 1000) or forced refresh
      if (movie.id > 1000 || forceRefresh) {
        setIsGenerating(true);
        toast({
          title: "Generating AI Review",
          description: `Creating a fresh review for "${movie.title}" using Gemini AI...`,
          duration: 5000,
        });
      }
      
      console.log("Calling getAIReview for movie:", movie.title);
      const reviewData = await getAIReview(movie.id, forceRefresh);
      setAiReview(reviewData);
      
      // Check if this is a mock review by examining content
      if (
        !geminiApiConfigured || 
        (reviewData.summary && (
          reviewData.summary.includes("mock review") || 
          reviewData.summary.includes("API key is not configured") ||
          reviewData.summary.includes("API key not set") ||
          reviewData.summary.includes("API keys are not configured")
        ))
      ) {
        setIsMockReview(true);
        console.log("Using mock review data - Gemini API key not properly configured");
        toast({
          title: "API Key Issue",
          description: `Using mock review data. Your Gemini API key (${API_CONFIG.gemini.apiKey?.substring(0, 3)}...) appears to be invalid or missing.`,
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
          description: `We've created a detailed review for "${movie.title}" with Gemini AI`,
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
    apiKeyConfigured: apiKeyState.configured,
    refreshReview: () => fetchAIReview(true)
  };
};
