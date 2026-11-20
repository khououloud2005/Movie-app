import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Movie } from '../../interfaces/movie';
import { MovieService } from '../../services/movie-service';
import { MovieCard } from '../movie-card/movie-card';
import { MovieSearch } from '../movie-search/movie-search';
import { SearchBar } from '../search-bar/search-bar';

type SortKey = 'default' | 'rating' | 'date' | 'title';

const SORT_KEYS: readonly SortKey[] = ['default', 'rating', 'date', 'title'];

function isSortKey(value: string): value is SortKey {
  return SORT_KEYS.some((key) => key === value);
}

@Component({
  selector: 'app-movie-list',
  imports: [SearchBar, MovieSearch, MovieCard],
  templateUrl: './movie-list.html',
  styleUrl: './movie-list.css',
})
export class MovieList implements OnInit {
  protected readonly movieService = inject(MovieService);

  protected readonly loading = signal(false);
  protected readonly error = signal(false);
  protected readonly sortBy = signal<SortKey>('default');
  protected readonly skeletons = Array.from({ length: 12 }, (_, i) => i);

  protected readonly hasMore = computed(
    () => this.movieService.currentPage() < this.movieService.totalPages(),
  );

  protected readonly sortedMovies = computed<Movie[]>(() => {
    const movies = [...this.movieService.movieList()];
    switch (this.sortBy()) {
      case 'rating':
        return movies.sort((a, b) => b.vote_average - a.vote_average);
      case 'date':
        return movies.sort((a, b) => b.release_date.localeCompare(a.release_date));
      case 'title':
        return movies.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return movies;
    }
  });

  ngOnInit(): void {
    // On ne recharge pas si la liste est déjà là (retour depuis un détail).
    if (this.movieService.movieList().length === 0) {
      this.loadMore();
    }
  }

  protected onTitleChange(title: string): void {
    this.movieService.searchTerm.set(title);
  }

  protected onSort(value: string): void {
    if (isSortKey(value)) {
      this.sortBy.set(value);
    }
  }

  protected loadMore(): void {
    if (this.loading()) {
      return;
    }
    this.loading.set(true);
    this.error.set(false);

    this.movieService.getMovieList(this.movieService.currentPage() + 1).subscribe({
      next: (response) => {
        this.movieService.movieList.update((list) => {
          const known = new Set(list.map((movie) => movie.id));
          return [...list, ...response.results.filter((movie) => !known.has(movie.id))];
        });
        this.movieService.currentPage.set(response.page);
        this.movieService.totalPages.set(response.total_pages);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }
}
