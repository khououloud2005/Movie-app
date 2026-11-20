import { Component, linkedSignal, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';
import { debounceTime, distinctUntilChanged, map, Subject } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  imports: [FaIconComponent],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
})
export class SearchBar {
  /** Titre à afficher au départ (ex. recherche conservée après un retour de détail). */
  readonly initialValue = input('');
  /** Titre saisi, émis vers le composant père après 300 ms sans frappe. */
  readonly titleChange = output<string>();

  protected readonly faMagnifyingGlass = faMagnifyingGlass;
  protected readonly faXmark = faXmark;

  protected readonly text = linkedSignal(() => this.initialValue());

  private readonly typed$ = new Subject<string>();

  constructor() {
    this.typed$
      .pipe(
        debounceTime(300),
        map((value) => value.trim()),
        distinctUntilChanged(),
        takeUntilDestroyed(),
      )
      .subscribe((title) => this.titleChange.emit(title));
  }

  protected searchMovieByTitle(title: string): void {
    this.text.set(title);
    this.typed$.next(title);
  }

  protected clear(): void {
    this.text.set('');
    this.titleChange.emit('');
  }
}
