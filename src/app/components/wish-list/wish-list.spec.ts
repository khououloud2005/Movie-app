import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { WishList } from './wish-list';
import { MovieService } from '../../services/movie-service';

describe('WishList', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [WishList],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('shows an empty state, then the saved movies', async () => {
    const fixture = TestBed.createComponent(WishList);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Your wish list is empty');

    TestBed.inject(MovieService).toggleWishlist({
      id: 5,
      title: 'Five',
      poster_path: null,
      release_date: '',
      vote_average: 0,
    });
    await fixture.whenStable();
    expect(el.querySelectorAll('app-movie-card').length).toBe(1);
  });
});
