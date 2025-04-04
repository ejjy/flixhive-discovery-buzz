
import React from 'react';
import { Card } from '@/components/ui/card';
import { Movie } from '@/types/movie';
import AIReviewSummary from './AIReviewSummary';
import AIReviewProsConsSection from './AIReviewProsConsSection';
import AIReviewFooter from './AIReviewFooter';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
