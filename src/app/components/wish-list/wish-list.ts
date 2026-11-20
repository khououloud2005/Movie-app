import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faHeart, faTrash } from '@fortawesome/free-solid-svg-icons';
import { MovieService } from '../../services/movie-service';
import { MovieCard } from '../movie-card/movie-card';

@Component({
  selector: 'app-wish-list',
  imports: [MovieCard, RouterLink, FaIconComponent],
  templateUrl: './wish-list.html',
  styleUrl: './wish-list.css',
})
export class WishList {
  protected readonly movieService = inject(MovieService);
  protected readonly faHeart = faHeart;
  protected readonly faTrash = faTrash;

  protected clearAll(): void {
    if (confirm('Remove all movies from your wish list?')) {
      this.movieService.clearWishlist();
    }
  }
}
