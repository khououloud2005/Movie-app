import { Component, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { catchError, of, switchMap, tap } from 'rxjs';
import { Movie } from '../../interfaces/movie';
import { MovieService } from '../../services/movie-service';
import { MovieCard } from '../movie-card/movie-card';

@Component({
  selector: 'app-movie-search',
  imports: [MovieCard],
  templateUrl: './movie-search.html',
  styleUrl: './movie-search.css',
})
export class MovieSearch {
  /** Titre à rechercher (non vide, fourni par movie-list). */
  readonly title = input.required<string>();

  private readonly movieService = inject(MovieService);

  protected readonly results = signal<Movie[]>([]);
  protected readonly totalResults = signal(0);
  protected readonly loading = signal(true);
  protected readonly error = signal(false);
  protected readonly skeletons = Array.from({ length: 8 }, (_, i) => i);

  constructor() {
    toObservable(this.title)
      .pipe(
        tap(() => {
          this.loading.set(true);
          this.error.set(false);
        }),
        // switchMap annule la requête précédente si l'utilisateur continue de taper.
        switchMap((title) =>
          this.movieService.getMovieByTitle(title).pipe(
            catchError(() => {
              this.error.set(true);
              return of(null);
            }),
          ),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((response) => {
        this.results.set(response?.results ?? []);
        this.totalResults.set(response?.total_results ?? 0);
        this.loading.set(false);
      });
  }
}
