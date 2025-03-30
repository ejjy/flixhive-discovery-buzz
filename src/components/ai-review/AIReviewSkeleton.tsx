
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const AIReviewSkeleton = () => {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-3/4" />
      <Skeleton className="h-32 w-full" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>
    </div>
  );
};

export default AIReviewSkeleton;
