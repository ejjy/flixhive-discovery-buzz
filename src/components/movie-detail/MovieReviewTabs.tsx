
import React from 'react';
import { Movie, Review } from '@/types/movie';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import AIReviewSection from '@/components/AIReviewSection';

interface MovieReviewTabsProps {
  movie: Movie;
  reviews?: Review[];
  isLoadingReviews: boolean;
}

const MovieReviewTabs: React.FC<MovieReviewTabsProps> = ({ 
  movie, 
  reviews, 
  isLoadingReviews 
}) => {
  return (
    <Tabs defaultValue="ai-review" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="ai-review">AI Review</TabsTrigger>
        <TabsTrigger value="user-reviews">User Reviews</TabsTrigger>
      </TabsList>
      
      <TabsContent value="ai-review" id="ai-review" className="mt-6">
        <AIReviewSection movie={movie} />
      </TabsContent>
      
      <TabsContent value="user-reviews" className="mt-6">
        {isLoadingReviews ? (
          <div className="space-y-6">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </div>
        ) : reviews && reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="p-4 rounded-lg bg-flixhive-gray/30 border border-flixhive-gray/30">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold">{review.author}</h3>
                  <div className="flex items-center">
                    <Star className="rating-star w-4 h-4 mr-1" fill="currentColor" />
                    <span>{review.rating}/10</span>
                  </div>
                </div>
                <p className="text-gray-300">{review.content}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400">No user reviews yet. Be the first to review!</p>
            <Button className="mt-4 bg-flixhive-primary hover:bg-flixhive-primary/90">
              Write a Review
            </Button>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default MovieReviewTabs;
