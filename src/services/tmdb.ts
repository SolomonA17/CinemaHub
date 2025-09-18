import { Movie, MovieDetails, TMDBResponse, MovieCredits } from '@/types/movie';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// For demo purposes, using a demo API key
// Users should replace this with their own TMDB API key
const API_KEY = '8265bd1679663a7ea12ac168da84d2e8'; // Demo key - replace with your own

class TMDBService {
  private async fetchFromTMDB<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${TMDB_BASE_URL}${endpoint}?api_key=${API_KEY}`);
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }

  async getTrendingMovies(): Promise<Movie[]> {
    const data = await this.fetchFromTMDB<TMDBResponse<Movie>>('/trending/movie/week');
    return data.results;
  }

  async getPopularMovies(): Promise<Movie[]> {
    const data = await this.fetchFromTMDB<TMDBResponse<Movie>>('/movie/popular');
    return data.results;
  }

  async getTopRatedMovies(): Promise<Movie[]> {
    const data = await this.fetchFromTMDB<TMDBResponse<Movie>>('/movie/top_rated');
    return data.results;
  }

  async getMovieDetails(movieId: number): Promise<MovieDetails> {
    return this.fetchFromTMDB<MovieDetails>(`/movie/${movieId}`);
  }

  async getMovieCredits(movieId: number): Promise<MovieCredits> {
    return this.fetchFromTMDB<MovieCredits>(`/movie/${movieId}/credits`);
  }

  async searchMovies(query: string): Promise<Movie[]> {
    if (!query.trim()) return [];
    
    const data = await this.fetchFromTMDB<TMDBResponse<Movie>>(
      `/search/movie?query=${encodeURIComponent(query)}`
    );
    return data.results;
  }

  getImageUrl(path: string | null, size: 'w200' | 'w300' | 'w400' | 'w500' | 'w780' | 'original' = 'w500'): string {
    if (!path) return '/placeholder-movie.jpg';
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
  }

  getPosterUrl(path: string | null): string {
    return this.getImageUrl(path, 'w500');
  }

  getBackdropUrl(path: string | null): string {
    return this.getImageUrl(path, 'w780');
  }
}

export const tmdbService = new TMDBService();