/** Film tel que renvoyé par les listes TMDB (now_playing, search). */
export interface Movie {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  title: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

/** Sous-ensemble suffisant pour afficher une carte et gérer la wish list. */
export type MovieSummary = Pick<
  Movie,
  'id' | 'title' | 'poster_path' | 'release_date' | 'vote_average'
>;
