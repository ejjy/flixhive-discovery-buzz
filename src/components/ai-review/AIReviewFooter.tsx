
import React from 'react';
import { BookOpen, Star } from 'lucide-react';

interface AIReviewFooterProps {
  watchRecommendation: string;
  isMockReview: boolean;
  hasError: boolean;
  isNewDiscovery: boolean;
}

const AIReviewFooter: React.FC<AIReviewFooterProps> = ({
  watchRecommendation,
  isMockReview,
  hasError,
  isNewDiscovery,
}) => {
  return (
    <>
      <div className="mt-6 pt-4 border-t border-white/10">
        <h4 className="text-lg font-medium flex items-center gap-2 mb-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Recommendation
        </h4>
        <p className="text-white/80 italic">{watchRecommendation}</p>
      </div>

      <div className="mt-4 text-xs text-white/40 flex items-center gap-1">
        <BookOpen className="h-3 w-3" />
        {isMockReview ? (
          <span>This is a mock review. Configure Gemini API key in Netlify for real AI reviews.</span>
        ) : hasError ? (
          <span>Generated with limited information. Try refreshing for a better review.</span>
        ) : isNewDiscovery ? (
          <span>AI-generated review created by analyzing online sources for this movie</span>
        ) : (
          <span>AI-generated from multiple credible sources including IMDb, Rotten Tomatoes, and Wikipedia</span>
        )}
      </div>
    </>
  );
};

export default AIReviewFooter;
