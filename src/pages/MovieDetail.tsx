import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/navbar';
import { getMovieById, getMovieReviews } from '@/services/movieService';
import { useWatchlist } from '@/contexts/WatchlistContext';
import MovieHero from '@/components/movie-detail/MovieHero';
import MoviePoster from '@/components/movie-detail/MoviePoster';
import MovieHeader from '@/components/movie-detail/MovieHeader';
import MovieOverview from '@/components/movie-detail/MovieOverview';
import MovieReviewTabs from '@/components/movie-detail/MovieReviewTabs';
import MovieDetailSkeleton from '@/components/movie-detail/MovieDetailSkeleton';
import MovieNotFound from '@/components/movie-detail/MovieNotFound';

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
    return <MovieDetailSkeleton />;
  }

  if (!movie) {
    return <MovieNotFound />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <MovieHero movie={movie} />
      
      <div className="container mx-auto px-4 pb-12">
        <div className="flex flex-col md:flex-row gap-8 -mt-32 relative z-10">
          <MoviePoster 
            movie={movie} 
            isSaved={isSaved(movie.id)} 
            onToggleSave={handleWatchlistToggle} 
          />
          
          <div className="md:w-2/3 lg:w-3/4">
            <MovieHeader movie={movie} />
            
            <MovieOverview 
              overview={movie.overview} 
              director={movie.director} 
              cast={movie.cast} 
            />
            
            <MovieReviewTabs 
              movie={movie}
              reviews={reviews}
              isLoadingReviews={isLoadingReviews}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
