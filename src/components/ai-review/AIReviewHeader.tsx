
import React from 'react';
import { Film, Loader2, AlertTriangle, RefreshCw, Key, Activity } from 'lucide-react';
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
    <div className="flex items-center gap-3 flex-wrap">
      <Film className="h-8 w-8 text-flixhive-accent" />
      <h2 className="text-2xl font-bold">{title} - AI Review</h2>
      {isGenerating && (
        <div className="ml-auto flex items-center gap-2 text-flixhive-accent animate-pulse">
          <Activity className="h-4 w-4 animate-pulse" />
          <span className="text-sm">Generating review with AI...</span>
        </div>
      )}
      {isMockReview && (
        <div className="ml-auto flex items-center gap-2 text-yellow-500">
          <Key className="h-4 w-4" />
          <span className="text-sm">Mock Review (Configure API key in .env)</span>
        </div>
      )}
      {hasError && (
        <div className="ml-auto flex items-center gap-2 text-red-500">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-sm">AI Review Generation Issue</span>
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
