import { Link } from 'react-router-dom';
import { Heart, Star, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Movie } from '@/types/movie';
import { tmdbService } from '@/services/tmdb';
import { useFavorites } from '@/hooks/useFavorites';
import { cn } from '@/lib/utils';

interface MovieCardProps {
  movie: Movie;
  className?: string;
}

export function MovieCard({ movie, className }: MovieCardProps) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const isMovieFavorite = isFavorite(movie.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(movie);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'TBA';
    return new Date(dateString).getFullYear().toString();
  };

  const formatRating = (rating: number) => {
    return Math.round(rating * 10) / 10;
  };

  return (
    <Card className={cn("movie-card group relative overflow-hidden bg-card border-cinema-border", className)}>
      <Link to={`/movie/${movie.id}`}>
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={tmdbService.getPosterUrl(movie.poster_path)}
            alt={movie.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = '/placeholder-movie.jpg';
            }}
          />
          
          {/* Overlay with gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          
          {/* Rating badge */}
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 rounded-full px-2 py-1 text-xs">
            <Star className="h-3 w-3 fill-primary text-primary" />
            <span className="text-white font-medium">{formatRating(movie.vote_average)}</span>
          </div>

          {/* Favorite button */}
          <Button
            size="sm"
            variant="ghost"
            className={cn(
              "absolute top-2 right-2 h-8 w-8 p-0 bg-black/70 hover:bg-black/80 transition-colors",
              isMovieFavorite && "btn-favorite active"
            )}
            onClick={handleFavoriteClick}
          >
            <Heart className={cn("h-4 w-4", isMovieFavorite && "fill-current")} />
          </Button>

          {/* Movie info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <h3 className="font-semibold text-sm line-clamp-2 mb-1">{movie.title}</h3>
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(movie.release_date)}</span>
            </div>
          </div>
        </div>
      </Link>

      <CardContent className="p-3">
        <h3 className="font-semibold text-sm line-clamp-2 mb-1">{movie.title}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2">{movie.overview}</p>
      </CardContent>
    </Card>
  );
}