import { Component, computed, inject, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faFilm, faHeart, faStar } from '@fortawesome/free-solid-svg-icons';
import { MovieSummary } from '../../interfaces/movie';
import { MovieService } from '../../services/movie-service';

@Component({
  selector: 'app-movie-card',
  imports: [RouterLink, FaIconComponent, DecimalPipe],
  templateUrl: './movie-card.html',
  styleUrl: './movie-card.css',
})
export class MovieCard {
  readonly movie = input.required<MovieSummary>();

  private readonly movieService = inject(MovieService);

  protected readonly faHeart = faHeart;
  protected readonly faStar = faStar;
  protected readonly faFilm = faFilm;

  protected readonly posterUrl = computed(() =>
    this.movieService.imageUrl(this.movie().poster_path, 'w500'),
  );
  protected readonly year = computed(() => this.movie().release_date?.slice(0, 4) ?? '');
  protected readonly inWishlist = computed(() => this.movieService.isInWishlist(this.movie().id));

  protected toggleWishlist(): void {
    this.movieService.toggleWishlist(this.movie());
  }
}
