import { useState, useEffect, useCallback } from 'react';
import { Movie } from '@/types/movie';

const FAVORITES_KEY = 'movieApp_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Movie[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load favorites from localStorage:', error);
    }
  }, []);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Failed to save favorites to localStorage:', error);
    }
  }, [favorites]);

  const addFavorite = useCallback((movie: Movie) => {
    setFavorites(prev => {
      if (prev.some(fav => fav.id === movie.id)) {
        return prev; // Already in favorites
      }
      return [movie, ...prev];
    });
  }, []);

  const removeFavorite = useCallback((movieId: number) => {
    setFavorites(prev => prev.filter(movie => movie.id !== movieId));
  }, []);

  const toggleFavorite = useCallback((movie: Movie) => {
    setFavorites(prev => {
      const existingIndex = prev.findIndex(fav => fav.id === movie.id);
      if (existingIndex >= 0) {
        // Remove from favorites
        return prev.filter(fav => fav.id !== movie.id);
      } else {
        // Add to favorites
        return [movie, ...prev];
      }
    });
  }, []);

  const isFavorite = useCallback((movieId: number) => {
    return favorites.some(movie => movie.id === movieId);
  }, [favorites]);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    favoritesCount: favorites.length,
  };
}