import { Movie } from './movie';

export interface Genre {
  id: number;
  name: string;
}

/** Film tel que renvoyé par GET /movie/{id} (genres détaillés, durée, slogan…). */
export interface MovieDetails extends Omit<Movie, 'genre_ids'> {
  genres: Genre[];
  runtime: number | null;
  tagline: string;
  status: string;
}
