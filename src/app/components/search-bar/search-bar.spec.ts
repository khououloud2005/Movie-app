import { TestBed } from '@angular/core/testing';
import { SearchBar } from './search-bar';

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

describe('SearchBar', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SearchBar] }).compileComponents();
  });

  it('emits the trimmed title once, after the debounce delay', async () => {
    const fixture = TestBed.createComponent(SearchBar);
    const emitted: string[] = [];
    fixture.componentInstance.titleChange.subscribe((t: string) => emitted.push(t));
    await fixture.whenStable();

    const input = (fixture.nativeElement as HTMLElement).querySelector('input') as HTMLInputElement;
    for (const value of ['b', 'ba', 'bat  ']) {
      input.value = value;
      input.dispatchEvent(new Event('input'));
    }
    expect(emitted).toEqual([]);

    await wait(400);
    expect(emitted).toEqual(['bat']);
  });

  it('clears the field and emits an empty title immediately', async () => {
    const fixture = TestBed.createComponent(SearchBar);
    fixture.componentRef.setInput('initialValue', 'matrix');
    const emitted: string[] = [];
    fixture.componentInstance.titleChange.subscribe((t: string) => emitted.push(t));
    await fixture.whenStable();

    const el = fixture.nativeElement as HTMLElement;
    el.querySelector<HTMLButtonElement>('.clear')?.click();
    await fixture.whenStable();
    expect(emitted).toEqual(['']);
    expect(el.querySelector('input')?.value).toBe('');
  });
});
