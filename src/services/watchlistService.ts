
import { Movie } from "@/types/movie";

// In-memory storage for saved movies (simulates a database)
const savedMovies: number[] = [];

export const getSavedMovies = async (): Promise<number[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...savedMovies]), 300);
  });
};

export const saveMovie = async (movieId: number): Promise<number[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!savedMovies.includes(movieId)) {
        savedMovies.push(movieId);
      }
      resolve([...savedMovies]);
    }, 300);
  });
};

export const unsaveMovie = async (movieId: number): Promise<number[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = savedMovies.indexOf(movieId);
      if (index !== -1) {
        savedMovies.splice(index, 1);
      }
      resolve([...savedMovies]);
    }, 300);
  });
};
