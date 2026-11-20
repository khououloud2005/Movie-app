import { Component, computed, inject, input, signal } from '@angular/core';
import { DatePipe, DecimalPipe, Location } from '@angular/common';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faArrowLeft, faFilm, faHeart, faStar } from '@fortawesome/free-solid-svg-icons';
import { catchError, of, switchMap, tap } from 'rxjs';
import { MovieDetails } from '../../interfaces/movie-details';
import { MovieService } from '../../services/movie-service';

@Component({
  selector: 'app-movie-detail',
  imports: [FaIconComponent, DatePipe, DecimalPipe],
  templateUrl: './movie-detail.html',
  styleUrl: './movie-detail.css',
})
export class MovieDetail {
  /** Paramètre de route :id, injecté grâce à withComponentInputBinding(). */
  readonly id = input.required<string>();

  private readonly movieService = inject(MovieService);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly titleService = inject(Title);

  protected readonly faArrowLeft = faArrowLeft;
  protected readonly faHeart = faHeart;
  protected readonly faStar = faStar;
  protected readonly faFilm = faFilm;

  protected readonly movie = signal<MovieDetails | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal(false);
  private readonly retryTick = signal(0);

  protected readonly posterUrl = computed(() =>
    this.movieService.imageUrl(this.movie()?.poster_path ?? null, 'w500'),
  );
  protected readonly backdropCss = computed(() => {
    const url = this.movieService.imageUrl(this.movie()?.backdrop_path ?? null, 'w780');
    return url ? `url("${url}")` : 'none';
  });
  protected readonly inWishlist = computed(() => {
    const movie = this.movie();
    return movie ? this.movieService.isInWishlist(movie.id) : false;
  });
  protected readonly runtimeText = computed(() => {
    const minutes = this.movie()?.runtime;
    if (!minutes) {
      return null;
    }
    const hours = Math.floor(minutes / 60);
    const rest = String(minutes % 60).padStart(2, '0');
    return hours > 0 ? `${hours}h ${rest}min` : `${minutes}min`;
  });

  constructor() {
    toObservable(computed(() => ({ id: Number(this.id()), tick: this.retryTick() })))
      .pipe(
        tap(() => {
          this.loading.set(true);
          this.error.set(false);
          this.movie.set(null);
        }),
        switchMap(({ id }) =>
          this.movieService.getMovieById(id).pipe(
            catchError(() => {
              this.error.set(true);
              return of(null);
            }),
          ),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((movie) => {
        this.movie.set(movie);
        this.loading.set(false);
        if (movie) {
          this.titleService.setTitle(`${movie.title} · Movie List`);
        }
      });
  }

  protected backToMovieList(): void {
    // Revient à la page précédente (liste ou wish list) ; sinon à l'accueil.
    if (window.history.length > 1) {
      this.location.back();
    } else {
      void this.router.navigate(['/']);
    }
  }

  protected toggleWishlist(): void {
    const movie = this.movie();
    if (movie) {
      this.movieService.toggleWishlist(movie);
    }
  }

  protected retry(): void {
    this.retryTick.update((n) => n + 1);
  }
}
