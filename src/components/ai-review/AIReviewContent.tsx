
import React from 'react';
import { Card } from '@/components/ui/card';
import { Movie } from '@/types/movie';
import AIReviewSummary from './AIReviewSummary';
import AIReviewProsConsSection from './AIReviewProsConsSection';
import AIReviewFooter from './AIReviewFooter';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface AIReviewContentProps {
  movie: Movie;
  aiReview: any;
  isMockReview: boolean;
  hasError: boolean;
}

const AIReviewContent: React.FC<AIReviewContentProps> = ({
  movie,
  aiReview,
  isMockReview,
  hasError,
}) => {
  // Ensure we have valid data to display
  const summary = aiReview?.summary || "No summary available";
  const pros = Array.isArray(aiReview?.pros) ? aiReview.pros : [];
  const cons = Array.isArray(aiReview?.cons) ? aiReview.cons : [];
  const watchRecommendation = aiReview?.watchRecommendation || "No recommendation available";
  
  const handleOpenEnvFile = () => {
    // Show instructions for setting up API keys
    alert(`To enable real AI movie reviews, add one of these API keys to your .env file:

1. OpenRouter API:
   - Create an API key at https://openrouter.ai
   - Add VITE_OPENROUTER_API_KEY=your_key_here to .env

2. Perplexity API:
   - Get an API key from https://perplexity.ai
   - Add VITE_PERPLEXITY_API_KEY=your_key_here to .env

3. Gemini API:
   - Get a key from https://ai.google.dev
   - Add VITE_GEMINI_API_KEY=your_key_here to .env
   
After adding a key, restart the development server.

Current keys configured:
- OpenRouter: ${import.meta.env.VITE_OPENROUTER_API_KEY ? 'Yes (length: ' + import.meta.env.VITE_OPENROUTER_API_KEY.length + ')' : 'No'}
- Perplexity: ${import.meta.env.VITE_PERPLEXITY_API_KEY ? 'Yes (length: ' + import.meta.env.VITE_PERPLEXITY_API_KEY.length + ')' : 'No'}
- Gemini: ${import.meta.env.VITE_GEMINI_API_KEY ? 'Yes (length: ' + import.meta.env.VITE_GEMINI_API_KEY.length + ')' : 'No'}`);
  };
  
  return (
    <Card className="p-6 bg-flixhive-gray/30 border border-white/10">
      <div className="space-y-4">
        {hasError && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              There was a problem generating the AI review. Some information may be incomplete.
            </AlertDescription>
          </Alert>
        )}
        
        {isMockReview && (
          <Alert variant="warning" className="bg-yellow-900/20 border border-yellow-500/30">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <AlertDescription className="flex flex-col gap-3">
              <div>
                <span className="font-bold text-yellow-500">AI API Key Not Configured</span>
                <p className="text-white/80 mt-1">
                  You're seeing a mock review because no valid API key for AI reviews is properly set.
                </p>
              </div>
              <Button 
                variant="outline" 
                className="w-full border-yellow-500/50 text-yellow-500 hover:text-yellow-400" 
                onClick={handleOpenEnvFile}
              >
                How to Configure API Keys
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        <AIReviewSummary 
          movie={movie} 
          summary={summary} 
          isMockReview={isMockReview} 
          hasError={hasError} 
        />

        {(pros.length > 0 || cons.length > 0) && (
          <AIReviewProsConsSection pros={pros} cons={cons} />
        )}

        <AIReviewFooter 
          watchRecommendation={watchRecommendation} 
          isMockReview={isMockReview} 
          hasError={hasError} 
          isNewDiscovery={movie.id > 1000} 
        />
      </div>
    </Card>
  );
};

export default AIReviewContent;
