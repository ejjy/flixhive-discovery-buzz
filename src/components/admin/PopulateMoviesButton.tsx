
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { populateMoviesWithReviews, getPopulationStatus } from '@/services/moviePopulationService';

export const PopulateMoviesButton = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  
  const handlePopulate = async () => {
    setIsLoading(true);
    setProgress(0);
    setStatusMessage('Starting movie population...');
    
    try {
      await populateMoviesWithReviews((status) => {
        setProgress(status.progress);
        setStatusMessage(`Populated ${status.completed}/${status.total} movies (${status.progress}%)`);
      });
      
      toast({
        title: "Success",
        description: "Movies have been populated with reviews!",
        duration: 5000,
      });
      
    } catch (error) {
      console.error("Error populating movies:", error);
      toast({
        title: "Error",
        description: "Failed to populate movies. See console for details.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-row gap-4 items-center">
        <Button 
          onClick={handlePopulate} 
          disabled={isLoading}
          variant="default"
        >
          {isLoading ? 'Populating...' : 'Populate Movies (1990-present)'}
        </Button>
        <span className="text-sm text-muted-foreground">
          {isLoading ? statusMessage : 'Click to add movies from 1990 to present to the database'}
        </span>
      </div>
      
      {isLoading && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground text-right">{progress}% complete</p>
        </div>
      )}
    </div>
  );
};
