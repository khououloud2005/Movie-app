import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { MovieDetail } from './movie-detail';

describe('MovieDetail', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [MovieDetail],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('loads the movie from the route id and shows its details', async () => {
    const fixture = TestBed.createComponent(MovieDetail);
    fixture.componentRef.setInput('id', '42');
    await fixture.whenStable();

    TestBed.inject(HttpTestingController)
      .expectOne((r) => r.url.endsWith('/movie/42'))
      .flush({
        id: 42, title: 'The Answer', original_title: 'The Answer', original_language: 'en',
        overview: 'Everything.', release_date: '2023-08-30', runtime: 125, tagline: 'Ask',
        status: 'Released', vote_average: 7.3, vote_count: 1027, popularity: 1, adult: false,
        backdrop_path: null, poster_path: null, video: false, genres: [{ id: 1, name: 'Action' }],
      });
    await fixture.whenStable();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('The Answer');
    expect(text).toContain('2h 05min');
    expect(text).toContain('Action');
  });
});
