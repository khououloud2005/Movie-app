import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { MovieList } from './movie-list';
import { Movie } from '../../interfaces/movie';

function film(id: number, title: string, vote: number): Movie {
  return {
    id, title, adult: false, backdrop_path: null, genre_ids: [], original_language: 'en',
    original_title: title, overview: '', popularity: 1, poster_path: null,
    release_date: '2023-01-01', video: false, vote_average: vote, vote_count: 1,
  };
}

describe('MovieList', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [MovieList],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('loads now playing movies and sorts them by rating', async () => {
    const fixture = TestBed.createComponent(MovieList);
    await fixture.whenStable();
    TestBed.inject(HttpTestingController)
      .expectOne((r) => r.url.endsWith('/movie/now_playing'))
      .flush({ page: 1, total_pages: 2, total_results: 2, results: [film(1, 'Low', 3), film(2, 'High', 9)] });
    await fixture.whenStable();

    const el = fixture.nativeElement as HTMLElement;
    const titles = () => Array.from(el.querySelectorAll('app-movie-card h2')).map((h) => h.textContent?.trim());
    expect(titles()).toEqual(['Low', 'High']);
    expect(el.textContent).toContain('Load more movies');

    const select = el.querySelector('select') as HTMLSelectElement;
    select.value = 'rating';
    select.dispatchEvent(new Event('change'));
    await fixture.whenStable();
    expect(titles()).toEqual(['High', 'Low']);
  });

  it('shows an error with a retry button when the request fails', async () => {
    const fixture = TestBed.createComponent(MovieList);
    await fixture.whenStable();
    TestBed.inject(HttpTestingController)
      .expectOne((r) => r.url.endsWith('/movie/now_playing'))
      .flush('boom', { status: 500, statusText: 'Server Error' });
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Retry');
  });
});
