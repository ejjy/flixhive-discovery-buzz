import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Star, 
  Clock, 
  Heart, 
  Play,
  CalendarDays,
  PlusCircle,
  MinusCircle,
  Film,
  Users
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  getMovieById, 
  getMovieReviews,
  getAIReview
} from '@/services/movieService';
import { useWatchlist } from '@/contexts/WatchlistContext';

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const movieId = parseInt(id || '0');
  const navigate = useNavigate();
  const { isSaved, toggleSave } = useWatchlist();
  
  const { data: movie, isLoading: isLoadingMovie, error } = useQuery({
    queryKey: ['movie', movieId],
    queryFn: () => getMovieById(movieId),
    enabled: !!movieId,
  });

  const { data: reviews, isLoading: isLoadingReviews } = useQuery({
    queryKey: ['movieReviews', movieId],
    queryFn: () => getMovieReviews(movieId),
    enabled: !!movieId,
  });

  const { data: aiReview, isLoading: isLoadingAIReview } = useQuery({
    queryKey: ['aiReview', movieId],
    queryFn: () => getAIReview(movieId),
    enabled: !!movieId,
  });

  useEffect(() => {
    if (error) {
      navigate('/not-found', { replace: true });
    }
  }, [error, navigate]);

  const handleWatchlistToggle = async () => {
    if (movieId) {
      await toggleSave(movieId);
    }
  };

  if (isLoadingMovie) {
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
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Movie not found</h1>
          <p className="mb-6">The movie you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Movie Hero Section */}
      <div className="relative w-full h-[50vh] lg:h-[60vh]">
        <div className="absolute inset-0">
          <img
            src={movie.backdropPath}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-black/50"></div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 pb-12">
        <div className="flex flex-col md:flex-row gap-8 -mt-32 relative z-10">
          {/* Movie Poster */}
          <div className="md:w-1/3 lg:w-1/4 flex-shrink-0">
            <img
              src={movie.posterPath}
              alt={movie.title}
              className="w-full rounded-lg shadow-2xl"
            />
            
            <div className="mt-6 space-y-4">
              <Button 
                className={`w-full ${
                  isSaved(movie.id) 
                    ? 'bg-flixhive-accent hover:bg-flixhive-accent/90' 
                    : 'bg-flixhive-primary hover:bg-flixhive-primary/90'
                }`}
                onClick={handleWatchlistToggle}
              >
                {isSaved(movie.id) ? (
                  <>
                    <MinusCircle className="mr-2 h-4 w-4" /> Remove from Watchlist
                  </>
                ) : (
                  <>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add to Watchlist
                  </>
                )}
              </Button>
              
              {movie.platformRatings && movie.platformRatings.length > 0 && (
                <div className="bg-flixhive-gray/30 rounded-lg p-4 mt-4">
                  <h3 className="font-medium mb-3">Ratings Across Platforms:</h3>
                  <div className="space-y-3">
                    {movie.platformRatings.map((rating, index) => (
                      <div key={index} className="flex flex-col">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">{rating.platform}</span>
                          <span className="text-sm font-medium">
                            {rating.score}/{rating.outOf}
                          </span>
                        </div>
                        <Progress 
                          value={(rating.score / rating.outOf) * 100} 
                          className="h-2"
                          indicatorClassName={
                            rating.score / rating.outOf >= 0.75
                              ? 'bg-green-500'
                              : rating.score / rating.outOf >= 0.6
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {movie.platforms && movie.platforms.length > 0 && (
                <div className="bg-flixhive-gray/30 rounded-lg p-4">
                  <h3 className="font-medium mb-2">Available on:</h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.platforms.map((platform, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="bg-flixhive-gray/50 text-white border-white/10"
                      >
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Movie Details */}
          <div className="md:w-2/3 lg:w-3/4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {movie.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6">
              <div className="flex items-center">
                <Star className="rating-star w-5 h-5 mr-1" fill="currentColor" />
                <span className="font-medium">{movie.voteAverage.toFixed(1)}</span>
              </div>
              
              <div className="flex items-center text-gray-400">
                <CalendarDays className="w-4 h-4 mr-1" />
                <span>{new Date(movie.releaseDate).getFullYear()}</span>
              </div>
              
              {movie.runtime && (
                <div className="flex items-center text-gray-400">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{movie.runtime} min</span>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                {movie.genres.map((genre, index) => (
                  <Badge key={index} variant="outline" className="bg-flixhive-primary/20 border-flixhive-primary/30 text-white">
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-2">Overview</h2>
              <p className="text-gray-300">{movie.overview}</p>
            </div>
            
            {(movie.director || (movie.cast && movie.cast.length > 0)) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {movie.director && (
                  <div>
                    <h2 className="text-lg font-bold mb-2 flex items-center">
                      <Film className="w-4 h-4 mr-2 text-flixhive-accent" /> Director
                    </h2>
                    <p className="text-gray-300">{movie.director}</p>
                  </div>
                )}
                
                {movie.cast && movie.cast.length > 0 && (
                  <div>
                    <h2 className="text-lg font-bold mb-2 flex items-center">
                      <Users className="w-4 h-4 mr-2 text-flixhive-accent" /> Cast
                    </h2>
                    <p className="text-gray-300">{movie.cast.join(', ')}</p>
                  </div>
                )}
              </div>
            )}
            
            <Tabs defaultValue="ai-review" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="ai-review">AI Review</TabsTrigger>
                <TabsTrigger value="user-reviews">User Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="ai-review" id="ai-review" className="mt-6">
                {isLoadingAIReview ? (
                  <div className="space-y-4">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ) : aiReview ? (
                  <div className="space-y-6">
                    <div className="p-6 rounded-lg bg-flixhive-primary/10 border border-flixhive-primary/20">
                      <h3 className="text-xl font-bold mb-3">AI-Generated Summary</h3>
                      <p className="text-gray-300">{aiReview.summary}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 rounded-lg bg-green-900/20 border border-green-900/30">
                        <h3 className="text-lg font-bold mb-2 text-green-400">What Works</h3>
                        <ul className="space-y-2">
                          {aiReview.pros.map((pro, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-green-400 mr-2">+</span>
                              <span className="text-gray-300">{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="p-4 rounded-lg bg-red-900/20 border border-red-900/30">
                        <h3 className="text-lg font-bold mb-2 text-red-400">What Doesn't</h3>
                        <ul className="space-y-2">
                          {aiReview.cons.map((con, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-red-400 mr-2">-</span>
                              <span className="text-gray-300">{con}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-flixhive-gray/30 border border-flixhive-gray/40">
                      <h3 className="text-lg font-bold mb-2">Final Verdict</h3>
                      <p className="text-gray-300">{aiReview.watchRecommendation}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No AI review available for this movie yet.</p>
                  </div>
                )}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;

