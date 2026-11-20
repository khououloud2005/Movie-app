import { Routes } from '@angular/router';
import { MovieList } from './components/movie-list/movie-list';
import { WishList } from './components/wish-list/wish-list';
import { MovieDetail } from './components/movie-detail/movie-detail';

// Du plus spécifique au plus général : le joker '**' doit rester en dernier.
export const routes: Routes = [
  { path: '', component: MovieList, title: 'Movie List' },
  { path: 'wishlist', component: WishList, title: 'Wish list' },
  { path: 'movie/:id', component: MovieDetail },
  { path: '**', redirectTo: '' },
];
