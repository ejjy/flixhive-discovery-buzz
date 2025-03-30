
import React from 'react';
import { MessageSquare, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AIReviewEmptyProps {
  onRefresh: () => void;
}

const AIReviewEmpty: React.FC<AIReviewEmptyProps> = ({ onRefresh }) => {
  return (
    <Card className="p-6 bg-flixhive-gray/30 border border-white/10">
      <div className="text-center py-8">
        <MessageSquare className="h-16 w-16 mx-auto mb-4 text-flixhive-accent opacity-50" />
        <h3 className="text-2xl font-semibold mb-2">No AI Review Available</h3>
        <p className="text-white/60 mb-6">We couldn't find an AI-generated review for this movie.</p>
        <Button onClick={onRefresh} className="bg-flixhive-accent hover:bg-flixhive-accent/90">
          <RefreshCw className="mr-2 h-4 w-4" /> Generate Review
        </Button>
      </div>
    </Card>
  );
};

export default AIReviewEmpty;
