
import React from 'react';
import { Card } from '@/components/ui/card';
import { Movie } from '@/types/movie';
import AIReviewSummary from './AIReviewSummary';
import AIReviewProsConsSection from './AIReviewProsConsSection';
import AIReviewFooter from './AIReviewFooter';

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
  return (
    <Card className="p-6 bg-flixhive-gray/30 border border-white/10">
      <div className="space-y-4">
        <AIReviewSummary 
          movie={movie} 
          summary={aiReview.summary} 
          isMockReview={isMockReview} 
          hasError={hasError} 
        />

        <AIReviewProsConsSection pros={aiReview.pros} cons={aiReview.cons} />

        <AIReviewFooter 
          watchRecommendation={aiReview.watchRecommendation} 
          isMockReview={isMockReview} 
          hasError={hasError} 
          isNewDiscovery={movie.id > 1000} 
        />
      </div>
    </Card>
  );
};

export default AIReviewContent;
