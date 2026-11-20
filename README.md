# Movie List (movie-app)

Application Angular (TP-3, 3BI – IHEC) : liste de films TMDB, recherche, détail et wish list.

## Lancer le projet

```bash
npm install
npm start        # http://localhost:4200
npm test         # tests unitaires (Vitest)
npm run build    # build de production
```

La clé TMDB se trouve dans `src/environments/environment.ts` et `environment.development.ts`.
Ne publiez pas votre clé sur un dépôt public.

## Fonctionnalités

- Liste « now playing » avec pagination (« Load more ») et tri (note, date, titre)
- Recherche par titre avec debounce (RxJS `debounceTime` + `switchMap`), conservée au retour d'un détail
- Page détail (`/movie/:id`) : slogan, genres, durée, notes, synopsis, image de fond
- Wish list persistante (localStorage) avec compteur dans l'en-tête, cœur sur chaque carte, « Clear all »
- États de chargement (skeletons), d'erreur (bouton Retry) et de liste vide
- Design noir et jaune responsive, accessible (focus visible, aria-label, reduced motion)

## Routes

| Chemin | Composant |
| --- | --- |
| `/` | MovieList (+ SearchBar, MovieSearch) |
| `/movie/:id` | MovieDetail |
| `/wishlist` | WishList |
