
import React from 'react';
import { Film, Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AIReviewHeaderProps {
  title: string;
  isGenerating: boolean;
  isMockReview: boolean;
  hasError: boolean;
  onRefresh: () => void;
}

const AIReviewHeader: React.FC<AIReviewHeaderProps> = ({
  title,
  isGenerating,
  isMockReview,
  hasError,
  onRefresh,
}) => {
  return (
    <div className="flex items-center gap-3">
      <Film className="h-8 w-8 text-flixhive-accent" />
      <h2 className="text-2xl font-bold">{title} - AI Review</h2>
      {isGenerating && (
        <div className="ml-auto flex items-center gap-2 text-flixhive-accent animate-pulse">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Generating review...</span>
        </div>
      )}
      {isMockReview && (
        <div className="ml-auto flex items-center gap-2 text-yellow-500">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-sm">Mock Review (API key not set)</span>
        </div>
      )}
      {hasError && (
        <div className="ml-auto flex items-center gap-2 text-red-500">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-sm">Review Generation Issue</span>
        </div>
      )}
      {!isGenerating && (
        <Button 
          onClick={onRefresh} 
          variant="outline" 
          size="sm" 
          className="ml-auto"
          disabled={isGenerating}
        >
          <RefreshCw className="h-4 w-4 mr-1" /> Refresh
        </Button>
      )}
    </div>
  );
};

export default AIReviewHeader;
