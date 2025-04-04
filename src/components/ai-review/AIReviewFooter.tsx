
import React from 'react';
import { BookOpen, Star, AlertTriangle } from 'lucide-react';

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

      {isMockReview && (
        <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-900/30 rounded-md">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
            <div>
              <h5 className="font-medium text-yellow-500">API Key Configuration Issue</h5>
              <p className="text-sm text-white/70">
                This is a mock review. To get real AI-powered reviews:
              </p>
              <ol className="text-sm text-white/70 list-decimal ml-5 mt-1 space-y-1">
                <li>Make sure you set either VITE_OPENROUTER_API_KEY or VITE_PERPLEXITY_API_KEY in Netlify environment variables</li>
                <li>Verify the API key is correct and valid (should be a long string)</li>
                <li>Redeploy your site after updating the environment variables</li>
                <li>Check the browser console logs for more detailed error information</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {hasError && !isMockReview && (
        <div className="mt-4 p-3 bg-red-900/20 border border-red-900/30 rounded-md">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
            <div>
              <h5 className="font-medium text-red-500">Review Generation Failed</h5>
              <p className="text-sm text-white/70">
                We encountered an error while generating the AI review. This could be due to:
              </p>
              <ul className="text-sm text-white/70 list-disc ml-5 mt-1 space-y-1">
                <li>Temporary API service disruption</li>
                <li>Rate limiting on the AI service</li>
                <li>Network connectivity issues</li>
                <li>Invalid API key format or permissions</li>
              </ul>
              <p className="text-sm text-white/70 mt-2">
                Try refreshing the review, or check your API key configuration.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 text-xs text-white/40 flex items-center gap-1">
        <BookOpen className="h-3 w-3" />
        {isMockReview ? (
          <span>Mock review only. Configure OpenRouter or Perplexity API key in Netlify for real AI reviews.</span>
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
