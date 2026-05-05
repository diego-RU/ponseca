import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Tiny wrapper around `localStorage` that is safe to call from the server
 * (during SSR / prerender) — it simply no-ops there.
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  get<T>(key: string): T | null {
    if (!this.isBrowser) return null;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    if (!this.isBrowser) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* quota exceeded or disabled */
    }
  }

  remove(key: string): void {
    if (!this.isBrowser) return;
    window.localStorage.removeItem(key);
  }
}
