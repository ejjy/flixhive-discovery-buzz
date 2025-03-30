
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import Navbar from '@/components/Navbar';

const MovieDetailSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="w-full h-[50vh] rounded-lg" />
        <div className="mt-8">
          <Skeleton className="h-12 w-2/3 mb-4" />
          <Skeleton className="h-6 w-1/3 mb-6" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  );
};

export default MovieDetailSkeleton;
