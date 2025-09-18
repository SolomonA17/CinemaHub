import { Link } from 'react-router-dom';
import { Heart, Trash2 } from 'lucide-react';
import { Header } from '@/components/Header';
import { MovieCard } from '@/components/MovieCard';
import { Button } from '@/components/ui/button';
import { useFavorites } from '@/hooks/useFavorites';

export default function Favorites() {
  const { favorites, clearFavorites, favoritesCount } = useFavorites();

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to remove all movies from your favorites?')) {
      clearFavorites();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-glow mb-2">My Favorites</h1>
            <p className="text-muted-foreground">
              {favoritesCount > 0
                ? `You have ${favoritesCount} favorite ${favoritesCount === 1 ? 'movie' : 'movies'}`
                : 'No favorite movies yet'
              }
            </p>
          </div>

          {favoritesCount > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClearAll}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>

        {/* Favorites Grid */}
        {favoritesCount > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {favorites.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <Heart className="h-24 w-24 mx-auto mb-6 text-muted-foreground/50" />
              <h2 className="text-2xl font-bold mb-4">No favorites yet</h2>
              <p className="text-muted-foreground mb-6">
                Start exploring movies and add them to your favorites by clicking the heart icon on any movie card.
              </p>
              <Button asChild className="btn-cinema">
                <Link to="/">
                  Discover Movies
                </Link>
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}