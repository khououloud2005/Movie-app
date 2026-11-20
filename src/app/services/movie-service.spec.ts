import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { MovieService } from './movie-service';
import { MovieSummary } from '../interfaces/movie';

const film: MovieSummary = {
  id: 7,
  title: 'Seven',
  poster_path: '/s.jpg',
  release_date: '1995-09-22',
  vote_average: 8.4,
};

describe('MovieService', () => {
  let service: MovieService;
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(MovieService);
    http = TestBed.inject(HttpTestingController);
  });

  it('requests the now playing list with the page number', () => {
    service.getMovieList(2).subscribe();
    const req = http.expectOne((r) => r.url.endsWith('/movie/now_playing'));
    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.has('api_key')).toBe(true);
    req.flush({ page: 2, results: [], total_pages: 5, total_results: 0 });
  });

  it('encodes the title in the search request', () => {
    service.getMovieByTitle('mission impossible').subscribe();
    const req = http.expectOne((r) => r.url.endsWith('/search/movie'));
    expect(req.request.params.get('query')).toBe('mission impossible');
    req.flush({ page: 1, results: [], total_pages: 0, total_results: 0 });
  });

  it('toggles the wish list and persists it', () => {
    service.toggleWishlist(film);
    expect(service.isInWishlist(7)).toBe(true);
    expect(service.wishlistCount()).toBe(1);
    expect(localStorage.getItem('movie-app.wishlist')).toContain('Seven');

    service.toggleWishlist(film);
    expect(service.isInWishlist(7)).toBe(false);
  });

  it('builds image urls and handles a missing poster', () => {
    expect(service.imageUrl('/a.jpg', 'w500')).toContain('w500/a.jpg');
    expect(service.imageUrl(null)).toBeNull();
  });
});
