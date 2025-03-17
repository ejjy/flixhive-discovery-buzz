
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import MovieCard from '@/components/MovieCard';
import { Skeleton } from '@/components/ui/skeleton';
import { getTrendingMovies, getAIReview } from '@/services/movieService';
import { TrendingUp, Tv } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AIReview, Movie } from '@/types/movie';

const PlatformBadge = ({ platform }: { platform: string }) => {
  const getColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'netflix': return 'bg-red-600';
      case 'disney+': return 'bg-blue-600';
      case 'hbo max': return 'bg-purple-600';
      case 'prime video': return 'bg-blue-400';
      case 'hulu': return 'bg-green-600';
      case 'apple tv+': return 'bg-gray-800';
      default: return 'bg-gray-600';
    }
  };

  return (
    <Badge className={`${getColor(platform)} mr-2 mb-2`}>
      {platform}
    </Badge>
  );
};

const OTTPlatforms = ({ movie }: { movie: Movie }) => {
  const { data: aiReview, isLoading } = useQuery({
    queryKey: ['aiReview', movie.id],
    queryFn: () => getAIReview(movie.id),
  });

  if (isLoading) {
    return <Skeleton className="h-8 w-full mt-2" />;
  }

  if (!aiReview?.ottPopularity || aiReview.ottPopularity.length === 0) {
    return <p className="text-sm text-gray-400 mt-2">No OTT platform data available</p>;
  }

  return (
    <div className="mt-2">
      <div className="flex flex-wrap">
        {aiReview.ottPopularity.map((platform, index) => (
          <PlatformBadge key={index} platform={platform.platform} />
        ))}
      </div>
      {aiReview.ottPopularity.map((platform, index) => (
        platform.trending && (
          <p key={index} className="text-xs text-green-400 flex items-center mt-1">
            <TrendingUp className="w-3 h-3 mr-1" />
            {platform.note || `Trending on ${platform.platform}`}
          </p>
        )
      ))}
    </div>
  );
};

const Trending = () => {
  const { data: trendingMovies, isLoading } = useQuery({
    queryKey: ['trendingMovies'],
    queryFn: getTrendingMovies,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-8 h-8 text-flixhive-accent" />
          <h1 className="text-3xl font-bold">Trending on OTT Platforms</h1>
        </div>
        
        <Card className="mb-8 bg-flixhive-dark/70 border-flixhive-accent/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tv className="w-5 h-5" />
              How This Works
            </CardTitle>
            <CardDescription>
              We analyze real-time data from major streaming platforms like Netflix, Disney+, HBO Max,
              Prime Video, and others to identify which movies are currently trending and popular.
              Our AI-powered system creates a comprehensive view of what's hot across all platforms.
            </CardDescription>
          </CardHeader>
        </Card>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, index) => (
              <Skeleton key={index} className="h-64 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <>
            {trendingMovies && trendingMovies.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trendingMovies.map((movie) => (
                  <Card key={movie.id} className="overflow-hidden border-flixhive-accent/20 hover:border-flixhive-accent/50 transition-all duration-300">
                    <div className="relative h-40">
                      <img 
                        src={movie.backdropPath} 
                        alt={movie.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                        <h3 className="text-xl font-bold text-white">{movie.title}</h3>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <Badge variant="outline" className="bg-flixhive-accent/10 text-flixhive-accent border-flixhive-accent/30">
                            {movie.voteAverage.toFixed(1)}
                          </Badge>
                          <span className="text-sm ml-2">{movie.genres.slice(0, 2).join(', ')}</span>
                        </div>
                        <span className="text-xs text-gray-400">{movie.releaseDate}</span>
                      </div>
                      <p className="text-sm text-gray-300 line-clamp-2 mb-3">{movie.overview}</p>
                      
                      <div className="mt-2">
                        <div className="flex items-center mb-1">
                          <Tv className="w-4 h-4 mr-2 text-flixhive-accent" />
                          <span className="text-sm font-medium">Available on:</span>
                        </div>
                        <OTTPlatforms movie={movie} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-gray-400">No trending movies available at the moment.</p>
              </div>
            )}
          </>
        )}
      </main>
      
      <footer className="bg-flixhive-dark py-8 text-center text-white/60">
        <div className="container mx-auto px-4">
          <p>© 2024 FlixHive - AI-Powered Movie Reviews and Recommendations</p>
        </div>
      </footer>
    </div>
  );
};

export default Trending;
