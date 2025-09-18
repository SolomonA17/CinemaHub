import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { Header } from '@/components/Header';
import { MovieCard } from '@/components/MovieCard';
import { LoadingScreen } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { tmdbService } from '@/services/tmdb';
import { Movie } from '@/types/movie';

export default function Home() {
  const [activeSection, setActiveSection] = useState<'trending' | 'popular' | 'top_rated' | 'search'>('trending');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Fetch trending movies
  const { data: trendingMovies, isLoading: trendingLoading } = useQuery({
    queryKey: ['movies', 'trending'],
    queryFn: () => tmdbService.getTrendingMovies(),
  });

  // Fetch popular movies
  const { data: popularMovies, isLoading: popularLoading } = useQuery({
    queryKey: ['movies', 'popular'],
    queryFn: () => tmdbService.getPopularMovies(),
  });

  // Fetch top rated movies
  const { data: topRatedMovies, isLoading: topRatedLoading } = useQuery({
    queryKey: ['movies', 'top_rated'],
    queryFn: () => tmdbService.getTopRatedMovies(),
  });

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setActiveSection('trending');
      setSearchResults([]);
      setSearchQuery('');
      return;
    }

    setIsSearching(true);
    setSearchQuery(query);
    setActiveSection('search');

    try {
      const results = await tmdbService.searchMovies(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const getCurrentMovies = () => {
    switch (activeSection) {
      case 'trending':
        return trendingMovies || [];
      case 'popular':
        return popularMovies || [];
      case 'top_rated':
        return topRatedMovies || [];
      case 'search':
        return searchResults;
      default:
        return [];
    }
  };

  const getCurrentTitle = () => {
    switch (activeSection) {
      case 'trending':
        return 'Trending Movies';
      case 'popular':
        return 'Popular Movies';
      case 'top_rated':
        return 'Top Rated Movies';
      case 'search':
        return `Search Results for "${searchQuery}"`;
      default:
        return 'Movies';
    }
  };

  const isLoading = () => {
    if (activeSection === 'search') return isSearching;
    if (activeSection === 'trending') return trendingLoading;
    if (activeSection === 'popular') return popularLoading;
    if (activeSection === 'top_rated') return topRatedLoading;
    return false;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="hero-gradient rounded-2xl p-8 mb-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-glow mb-4">
            Discover Amazing Movies
          </h1>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Explore trending movies, find your favorites, and build your personal collection
          </p>
        </div>

        {/* Section Navigation */}
        {activeSection !== 'search' && (
          <div className="flex flex-wrap gap-4 mb-8">
            <Button
              variant={activeSection === 'trending' ? 'default' : 'secondary'}
              onClick={() => setActiveSection('trending')}
              className="btn-cinema"
            >
              🔥 Trending
            </Button>
            <Button
              variant={activeSection === 'popular' ? 'default' : 'secondary'}
              onClick={() => setActiveSection('popular')}
            >
              ⭐ Popular
            </Button>
            <Button
              variant={activeSection === 'top_rated' ? 'default' : 'secondary'}
              onClick={() => setActiveSection('top_rated')}
            >
              🏆 Top Rated
            </Button>
          </div>
        )}

        {/* Movies Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{getCurrentTitle()}</h2>
            {activeSection === 'search' && searchResults.length > 0 && (
              <Button
                variant="ghost"
                onClick={() => {
                  setActiveSection('trending');
                  setSearchResults([]);
                  setSearchQuery('');
                }}
              >
                ← Back to Trending
              </Button>
            )}
          </div>

          {isLoading() ? (
            <LoadingScreen />
          ) : getCurrentMovies().length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {getCurrentMovies().map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : activeSection === 'search' ? (
            <div className="text-center py-12">
              <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No movies found</h3>
              <p className="text-muted-foreground">
                Try searching with different keywords
              </p>
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No movies available</h3>
              <p className="text-muted-foreground">
                Please check your connection and try again
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}