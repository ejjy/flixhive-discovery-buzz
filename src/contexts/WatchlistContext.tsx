
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSavedMovies, saveMovie, unsaveMovie } from '@/services/movieService';
import { useToast } from '@/components/ui/use-toast';

interface WatchlistContextType {
  savedMovieIds: number[];
  isLoading: boolean;
  isSaved: (id: number) => boolean;
  toggleSave: (id: number) => Promise<void>;
  addToWatchlist: (id: number) => Promise<void>;
  removeFromWatchlist: (id: number) => Promise<void>;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const WatchlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedMovieIds, setSavedMovieIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSavedMovies = async () => {
      try {
        const ids = await getSavedMovies();
        setSavedMovieIds(ids);
      } catch (error) {
        console.error('Failed to fetch saved movies:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your watchlist.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedMovies();
  }, [toast]);

  const isSaved = (id: number) => {
    return savedMovieIds.includes(id);
  };

  const addToWatchlist = async (id: number) => {
    try {
      setIsLoading(true);
      const updatedIds = await saveMovie(id);
      setSavedMovieIds(updatedIds);
      toast({
        title: 'Added to Watchlist',
        description: 'Movie has been added to your watchlist.',
      });
    } catch (error) {
      console.error('Failed to add movie to watchlist:', error);
      toast({
        title: 'Error',
        description: 'Failed to add movie to watchlist.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWatchlist = async (id: number) => {
    try {
      setIsLoading(true);
      const updatedIds = await unsaveMovie(id);
      setSavedMovieIds(updatedIds);
      toast({
        title: 'Removed from Watchlist',
        description: 'Movie has been removed from your watchlist.',
      });
    } catch (error) {
      console.error('Failed to remove movie from watchlist:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove movie from watchlist.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSave = async (id: number) => {
    if (isSaved(id)) {
      await removeFromWatchlist(id);
    } else {
      await addToWatchlist(id);
    }
  };

  return (
    <WatchlistContext.Provider
      value={{
        savedMovieIds,
        isLoading,
        isSaved,
        toggleSave,
        addToWatchlist,
        removeFromWatchlist,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};
