
import React from 'react';
import { Movie } from '@/types/movie';
import AIReviewSkeleton from './ai-review/AIReviewSkeleton';
import AIReviewEmpty from './ai-review/AIReviewEmpty';
import AIReviewHeader from './ai-review/AIReviewHeader';
import AIReviewContent from './ai-review/AIReviewContent';
import { useAIReview } from '@/hooks/useAIReview';

interface AIReviewSectionProps {
  movie: Movie;
}

const AIReviewSection: React.FC<AIReviewSectionProps> = ({ movie }) => {
  const {
    isLoading,
    aiReview,
    isGenerating,
    isMockReview,
    hasError,
    refreshReview
  } = useAIReview(movie);

  if (isLoading) {
    return <AIReviewSkeleton />;
  }

  if (!aiReview) {
    return <AIReviewEmpty onRefresh={refreshReview} />;
  }

  return (
    <div className="space-y-6">
      <AIReviewHeader 
        title={movie.title}
        isGenerating={isGenerating}
        isMockReview={isMockReview}
        hasError={hasError}
        onRefresh={refreshReview}
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
