
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import { MessageSquare, Star, Film, PenLine } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { getTopMovies } from '@/services/movieService';
import { Link } from 'react-router-dom';

const Reviews = () => {
  // Mock data for user reviews - in a real app, this would come from your backend
  const userReviews = [
    {
      id: 1,
      movieId: 1,
      movieTitle: "Inception",
      rating: 4.5,
      content: "One of the most mind-bending movies I've ever seen. Christopher Nolan at his best!",
      date: "2024-05-15"
    },
    {
      id: 2,
      movieId: 2,
      movieTitle: "The Shawshank Redemption",
      rating: 5,
      content: "A timeless classic about hope and redemption. Morgan Freeman's narration adds so much depth.",
      date: "2024-04-23"
    },
    {
      id: 3,
      movieId: 3,
      movieTitle: "Parasite",
      rating: 4.8,
      content: "Brilliant social commentary wrapped in a thrilling story. Deserved every award it received.",
      date: "2024-03-10"
    }
  ];

  const { data: movies, isLoading } = useQuery({
    queryKey: ['allMovies'],
    queryFn: getTopMovies,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-flixhive-accent" />
            <h1 className="text-3xl font-bold">My Reviews</h1>
          </div>
          
          <Button className="bg-flixhive-accent hover:bg-flixhive-accent/90">
            <PenLine className="mr-2 h-4 w-4" />
            Write a Review
          </Button>
        </div>
        
        {/* User's Reviews Section */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Your Reviews</h2>
          
          {userReviews.length > 0 ? (
            <div className="bg-flixhive-gray/20 rounded-lg border border-flixhive-gray/30 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Movie</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead className="hidden md:table-cell">Review</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userReviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell className="font-medium">
                        <Link to={`/movie/${review.movieId}`} className="hover:text-flixhive-accent transition-colors">
                          {review.movieTitle}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
                          <span>{review.rating}/5</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell max-w-xs truncate">
                        {review.content}
                      </TableCell>
                      <TableCell>{review.date}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 bg-flixhive-gray/20 rounded-lg border border-flixhive-gray/30">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-medium mb-2">No reviews yet</h3>
              <p className="text-muted-foreground mb-6">
                You haven't written any reviews yet. Share your thoughts on your favorite movies!
              </p>
              <Button className="bg-flixhive-primary hover:bg-flixhive-primary/90">
                Write Your First Review
              </Button>
            </div>
          )}
        </div>
        
        {/* Recommended Movies to Review Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Recommended Movies to Review</h2>
          
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array(5).fill(0).map((_, index) => (
                <Skeleton key={index} className="aspect-[2/3] w-full rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {movies?.slice(0, 5).map((movie) => (
                <div key={movie.id} className="bg-flixhive-gray/20 rounded-lg overflow-hidden">
                  <Link to={`/movie/${movie.id}`} className="block">
                    <img 
                      src={movie.posterPath} 
                      alt={movie.title} 
                      className="w-full aspect-[2/3] object-cover" 
                    />
                    <div className="p-3">
                      <h3 className="font-medium text-sm truncate">{movie.title}</h3>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center">
                          <Star className="h-3 w-3 text-yellow-500 mr-1" fill="currentColor" />
                          <span className="text-xs">{movie.voteAverage}</span>
                        </div>
                        <Button size="sm" variant="ghost" className="text-xs h-7 px-2">
                          Review
                        </Button>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <footer className="bg-flixhive-dark py-8 text-center text-white/60">
        <div className="container mx-auto px-4">
          <p>© 2024 FlixHive - AI-Powered Movie Reviews and Recommendations</p>
        </div>
      </footer>
    </div>
  );
};

export default Reviews;
