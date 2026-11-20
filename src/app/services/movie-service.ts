import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Movie, MovieSummary } from '../interfaces/movie';
import { MovieDetails } from '../interfaces/movie-details';
import { MovieResponse } from '../interfaces/movie-response';

export type ImageSize = 'w342' | 'w500' | 'w780' | 'original';

const WISHLIST_KEY = 'movie-app.wishlist';

function isMovieSummary(value: unknown): value is MovieSummary {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    typeof value.id === 'number' &&
    'title' in value &&
    typeof value.title === 'string'
  );
}

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.url_base;
  private readonly apiKey = environment.api_key;

  /** Liste « now playing » conservée entre deux navigations (pagination incluse). */
  readonly movieList = signal<Movie[]>([]);
  readonly currentPage = signal(0);
  readonly totalPages = signal(0);

  /** Dernier titre recherché, pour retrouver la recherche en revenant d'un détail. */
  readonly searchTerm = signal('');

  readonly wishlist = signal<MovieSummary[]>(this.loadWishlist());
  readonly wishlistCount = computed(() => this.wishlist().length);

  getMovieList(page = 1): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(`${this.baseUrl}/movie/now_playing`, {
      params: { api_key: this.apiKey, page },
    });
  }

  getMovieByTitle(title: string, page = 1): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(`${this.baseUrl}/search/movie`, {
      params: { api_key: this.apiKey, query: title, page },
    });
  }

  getMovieById(id: number): Observable<MovieDetails> {
    return this.http.get<MovieDetails>(`${this.baseUrl}/movie/${id}`, {
      params: { api_key: this.apiKey },
    });
  }

  imageUrl(path: string | null, size: ImageSize = 'w500'): string | null {
    return path ? `${environment.image_url}${size}${path}` : null;
  }

  isInWishlist(id: number): boolean {
    return this.wishlist().some((movie) => movie.id === id);
  }

  toggleWishlist(movie: MovieSummary): void {
    const summary: MovieSummary = {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
    };
    this.wishlist.update((list) =>
      list.some((m) => m.id === summary.id)
        ? list.filter((m) => m.id !== summary.id)
        : [...list, summary],
    );
    this.saveWishlist();
  }

  clearWishlist(): void {
    this.wishlist.set([]);
    this.saveWishlist();
  }

  private loadWishlist(): MovieSummary[] {
    try {
      const raw = localStorage.getItem(WISHLIST_KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.filter(isMovieSummary) : [];
    } catch {
      return [];
    }
  }

  private saveWishlist(): void {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(this.wishlist()));
    } catch {
      /* stockage indisponible : la wish list reste en mémoire */
    }
  }
}
