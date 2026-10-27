import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export const NAVBAR_COLORS = [
  { value: 'default', label: 'Alapértelmezett', hex: '#f8f9fb' },
  { value: 'gray', label: 'Világos szürke', hex: '#e5e7eb' },
  { value: 'blue', label: 'Világos kék', hex: '#dbeafe' },
  { value: 'green', label: 'Világos zöld', hex: '#dcfce7' },
  { value: 'orange', label: 'Világos narancssárga', hex: '#ffedd5' },
  { value: 'yellow', label: 'Világos sárga', hex: '#fef9c3' },
  { value: 'pink', label: 'Világos rózsaszín', hex: '#fce7f3' },
  { value: 'red', label: 'Világos piros', hex: '#fee2e2' },
  { value: 'brown', label: 'Világos barna', hex: '#efdfd0' },
  { value: 'purple', label: 'Világos lila', hex: '#ede9fe' }
] as const;

export type NavbarColor = (typeof NAVBAR_COLORS)[number]['value'];

const LEGACY_NAVBAR_COLOR_STORAGE_KEY = 'navbarColor';
const NAVBAR_COLOR_STORAGE_PREFIX = 'navbarColor:';

@Injectable({
  providedIn: 'root'
})
export class NavbarColorService {
  private readonly colorSubject = new BehaviorSubject<NavbarColor>('default');
  readonly color$ = this.colorSubject.asObservable();
  private userId: string | null = null;

  getColor(): NavbarColor {
    return this.colorSubject.value;
  }

  setUser(userId: number | string | null): void {
    this.userId = userId === null ? null : String(userId);
    if (this.userId === null) {
      this.colorSubject.next('default');
      return;
    }

    const storageKey = `${NAVBAR_COLOR_STORAGE_PREFIX}${this.userId}`;
    const savedColor = localStorage.getItem(storageKey);
    if (savedColor !== null) {
      this.colorSubject.next(this.parseColor(savedColor));
      return;
    }

    const legacyColor = localStorage.getItem(LEGACY_NAVBAR_COLOR_STORAGE_KEY);
    if (legacyColor !== null) {
      const migratedColor = this.parseColor(legacyColor);
      localStorage.setItem(storageKey, migratedColor);
      localStorage.removeItem(LEGACY_NAVBAR_COLOR_STORAGE_KEY);
      this.colorSubject.next(migratedColor);
      return;
    }

    this.colorSubject.next('default');
  }

  setColor(color: NavbarColor): void {
    if (this.userId !== null) {
      localStorage.setItem(`${NAVBAR_COLOR_STORAGE_PREFIX}${this.userId}`, color);
    }
    this.colorSubject.next(color);
  }

  private parseColor(color: string): NavbarColor {
    return NAVBAR_COLORS.find(option => option.value === color)?.value ?? 'default';
  }
}
