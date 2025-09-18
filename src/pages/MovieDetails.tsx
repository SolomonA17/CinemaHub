import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Heart, Star, Calendar, Clock, Globe, DollarSign } from 'lucide-react';
import { Header } from '@/components/Header';
import { LoadingScreen } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { tmdbService } from '@/services/tmdb';
import { useFavorites } from '@/hooks/useFavorites';
import { cn } from '@/lib/utils';

export default function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const movieId = parseInt(id || '0', 10);
  const { toggleFavorite, isFavorite } = useFavorites();

  const { data: movie, isLoading: movieLoading, error } = useQuery({
    queryKey: ['movie', movieId],
    queryFn: () => tmdbService.getMovieDetails(movieId),
    enabled: !!movieId,
  });

  const { data: credits } = useQuery({
    queryKey: ['movie', movieId, 'credits'],
    queryFn: () => tmdbService.getMovieCredits(movieId),
    enabled: !!movieId,
  });

  const isMovieFavorite = movie ? isFavorite(movie.id) : false;

  const formatRuntime = (minutes: number | null) => {
    if (!minutes) return 'Unknown';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatMoney = (amount: number) => {
    if (amount === 0) return 'Unknown';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'TBA';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (movieLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <LoadingScreen />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Movie Not Found</h1>
            <p className="text-muted-foreground mb-4">
              The movie you're looking for doesn't exist or couldn't be loaded.
            </p>
            <Button asChild>
              <Link to="/">← Back to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const director = credits?.crew.find(member => member.job === 'Director');
  const mainCast = credits?.cast.slice(0, 10) || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section with Backdrop */}
        <div className="relative h-[60vh] overflow-hidden">
          <img
            src={tmdbService.getBackdropUrl(movie.backdrop_path)}
            alt={movie.title}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = tmdbService.getPosterUrl(movie.poster_path);
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="container mx-auto">
              <Button variant="ghost" size="sm" asChild className="mb-4">
                <Link to="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Movies
                </Link>
              </Button>
              
              <div className="flex flex-col md:flex-row gap-6">
                <img
                  src={tmdbService.getPosterUrl(movie.poster_path)}
                  alt={movie.title}
                  className="w-48 h-72 object-cover rounded-lg shadow-lg"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-movie.jpg';
                  }}
                />
                
                <div className="flex-1">
                  <h1 className="text-3xl md:text-5xl font-bold mb-4 text-glow">
                    {movie.title}
                  </h1>
                  
                  {movie.tagline && (
                    <p className="text-lg italic text-muted-foreground mb-4">
                      "{movie.tagline}"
                    </p>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 fill-primary text-primary" />
                      <span className="font-semibold">{Math.round(movie.vote_average * 10) / 10}</span>
                      <span className="text-sm text-muted-foreground">
                        ({movie.vote_count.toLocaleString()} votes)
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(movie.release_date)}</span>
                    </div>
                    
                    {movie.runtime && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{formatRuntime(movie.runtime)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {movie.genres.map((genre) => (
                      <Badge key={genre.id} variant="secondary">
                        {genre.name}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex gap-4">
                    <Button
                      onClick={() => toggleFavorite(movie)}
                      className={cn(
                        "btn-favorite",
                        isMovieFavorite && "active"
                      )}
                    >
                      <Heart className={cn("h-4 w-4 mr-2", isMovieFavorite && "fill-current")} />
                      {isMovieFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                    </Button>
                    
                    {movie.homepage && (
                      <Button variant="outline" asChild>
                        <a href={movie.homepage} target="_blank" rel="noopener noreferrer">
                          <Globe className="h-4 w-4 mr-2" />
                          Official Site
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Movie Details */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              {/* Overview */}
              <Card className="mb-8">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Overview</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {movie.overview || 'No overview available.'}
                  </p>
                </CardContent>
              </Card>

              {/* Cast */}
              {mainCast.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Cast</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {mainCast.map((actor) => (
                        <div key={actor.id} className="text-center">
                          <img
                            src={tmdbService.getImageUrl(actor.profile_path, 'w200')}
                            alt={actor.name}
                            className="w-full aspect-square object-cover rounded-lg mb-2"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder-person.jpg';
                            }}
                          />
                          <h4 className="font-semibold text-sm">{actor.name}</h4>
                          <p className="text-xs text-muted-foreground">{actor.character}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar with additional details */}
            <div>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Details</h3>
                  <div className="space-y-4">
                    {director && (
                      <div>
                        <h4 className="font-semibold mb-1">Director</h4>
                        <p className="text-muted-foreground">{director.name}</p>
                      </div>
                    )}
                    
                    <div>
                      <h4 className="font-semibold mb-1">Status</h4>
                      <p className="text-muted-foreground">{movie.status}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-1">Original Language</h4>
                      <p className="text-muted-foreground uppercase">{movie.original_language}</p>
                    </div>
                    
                    {movie.budget > 0 && (
                      <div>
                        <h4 className="font-semibold mb-1">Budget</h4>
                        <p className="text-muted-foreground">{formatMoney(movie.budget)}</p>
                      </div>
                    )}
                    
                    {movie.revenue > 0 && (
                      <div>
                        <h4 className="font-semibold mb-1">Revenue</h4>
                        <p className="text-muted-foreground">{formatMoney(movie.revenue)}</p>
                      </div>
                    )}

                    {movie.production_companies.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-1">Production Companies</h4>
                        <div className="space-y-1">
                          {movie.production_companies.slice(0, 3).map((company) => (
                            <p key={company.id} className="text-sm text-muted-foreground">
                              {company.name}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}