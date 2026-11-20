import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HeadBar } from './head-bar';
import { MovieService } from '../../services/movie-service';

describe('HeadBar', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [HeadBar],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('shows the wish list count badge only when the list is not empty', async () => {
    const fixture = TestBed.createComponent(HeadBar);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.badge')).toBeNull();

    TestBed.inject(MovieService).toggleWishlist({
      id: 1,
      title: 'A',
      poster_path: null,
      release_date: '',
      vote_average: 0,
    });
    await fixture.whenStable();
    expect(el.querySelector('.badge')?.textContent?.trim()).toBe('1');
  });
});
