import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MovieCard } from './movie-card';
import { MovieService } from '../../services/movie-service';

describe('MovieCard', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [MovieCard],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders the title and toggles the wish list with the heart', async () => {
    const fixture = TestBed.createComponent(MovieCard);
    fixture.componentRef.setInput('movie', {
      id: 3,
      title: 'Three',
      poster_path: null,
      release_date: '2020-01-01',
      vote_average: 6.5,
    });
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h2')?.textContent).toContain('Three');
    expect(el.querySelector('.no-poster')).not.toBeNull();

    el.querySelector<HTMLButtonElement>('.heart')?.click();
    await fixture.whenStable();
    expect(TestBed.inject(MovieService).isInWishlist(3)).toBe(true);
    expect(el.querySelector('.heart')?.classList).toContain('active');
  });
});
