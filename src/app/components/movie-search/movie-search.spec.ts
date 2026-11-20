import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { MovieSearch } from './movie-search';

describe('MovieSearch', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [MovieSearch],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('displays the results of the search', async () => {
    const fixture = TestBed.createComponent(MovieSearch);
    fixture.componentRef.setInput('title', 'bat');
    await fixture.whenStable();

    const http = TestBed.inject(HttpTestingController);
    http.expectOne((r) => r.url.endsWith('/search/movie')).flush({
      page: 1,
      total_pages: 1,
      total_results: 1,
      results: [
        {
          id: 1, title: 'Batman', adult: false, backdrop_path: null, genre_ids: [],
          original_language: 'en', original_title: 'Batman', overview: '', popularity: 1,
          poster_path: null, release_date: '1989-06-23', video: false, vote_average: 7, vote_count: 10,
        },
      ],
    });
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Batman');
  });

  it('shows a message when nothing matches', async () => {
    const fixture = TestBed.createComponent(MovieSearch);
    fixture.componentRef.setInput('title', 'zzzz');
    await fixture.whenStable();
    TestBed.inject(HttpTestingController)
      .expectOne((r) => r.url.endsWith('/search/movie'))
      .flush({ page: 1, results: [], total_pages: 0, total_results: 0 });
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('No result');
  });
});
