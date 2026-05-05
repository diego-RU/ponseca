import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, defer, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

import { APP_CONFIG } from '../config/app-config';
import { Booking, BookingDraft, BookingStatus } from '../models/booking.model';
import { GalleryImage } from '../models/gallery-image.model';
import { MenuItem } from '../models/menu-item.model';
import { Review } from '../models/review.model';
import { User } from '../models/user.model';
import {
  MOCK_BOOKINGS,
  MOCK_GALLERY,
  MOCK_MENU,
  MOCK_REVIEWS,
  MOCK_USERS,
} from '../data/mock-data';

/**
 * Minimal REST API surface mirroring the endpoints described in the README.
 *
 * When `APP_CONFIG.api.baseUrl` is `null`, every method resolves against an
 * in-memory copy of the mock dataset so the UI is fully functional without
 * a backend. As soon as a base URL is provided, the same methods proxy
 * through HttpClient to the real API.
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);

  private readonly menu: MenuItem[] = structuredClone(MOCK_MENU);
  private readonly gallery: GalleryImage[] = structuredClone(MOCK_GALLERY);
  private readonly reviews: Review[] = structuredClone(MOCK_REVIEWS);
  private readonly bookings: Booking[] = structuredClone(MOCK_BOOKINGS);

  private get baseUrl(): string | null {
    return APP_CONFIG.api.baseUrl;
  }

  // ---------- Menú ----------

  getMenu(): Observable<MenuItem[]> {
    if (this.baseUrl) {
      return this.http.get<MenuItem[]>(`${this.baseUrl}/api/menu`);
    }
    return this.mock(() => [...this.menu]);
  }

  getMenuItem(id: string): Observable<MenuItem> {
    if (this.baseUrl) {
      return this.http.get<MenuItem>(`${this.baseUrl}/api/menu/${id}`);
    }
    const item = this.menu.find((m) => m.id === id);
    return item ? this.mock(() => item) : throwError(() => new Error('Plato no encontrado'));
  }

  createMenuItem(item: Omit<MenuItem, 'id'>): Observable<MenuItem> {
    if (this.baseUrl) {
      return this.http.post<MenuItem>(`${this.baseUrl}/api/menu`, item);
    }
    const created: MenuItem = { ...item, id: cryptoId('m') };
    this.menu.push(created);
    return this.mock(() => created);
  }

  updateMenuItem(id: string, patch: Partial<MenuItem>): Observable<MenuItem> {
    if (this.baseUrl) {
      return this.http.put<MenuItem>(`${this.baseUrl}/api/menu/${id}`, patch);
    }
    const idx = this.menu.findIndex((m) => m.id === id);
    if (idx < 0) return throwError(() => new Error('Plato no encontrado'));
    this.menu[idx] = { ...this.menu[idx], ...patch, id };
    return this.mock(() => this.menu[idx]);
  }

  deleteMenuItem(id: string): Observable<void> {
    if (this.baseUrl) {
      return this.http.delete<void>(`${this.baseUrl}/api/menu/${id}`);
    }
    const idx = this.menu.findIndex((m) => m.id === id);
    if (idx >= 0) this.menu.splice(idx, 1);
    return this.mock(() => undefined as void);
  }

  // ---------- Galería ----------

  getGallery(): Observable<GalleryImage[]> {
    if (this.baseUrl) {
      return this.http.get<GalleryImage[]>(`${this.baseUrl}/api/gallery`);
    }
    return this.mock(() => [...this.gallery]);
  }

  createGalleryImage(img: Omit<GalleryImage, 'id'>): Observable<GalleryImage> {
    if (this.baseUrl) {
      return this.http.post<GalleryImage>(`${this.baseUrl}/api/gallery`, img);
    }
    const created: GalleryImage = { ...img, id: cryptoId('g') };
    this.gallery.push(created);
    return this.mock(() => created);
  }

  deleteGalleryImage(id: string): Observable<void> {
    if (this.baseUrl) {
      return this.http.delete<void>(`${this.baseUrl}/api/gallery/${id}`);
    }
    const idx = this.gallery.findIndex((g) => g.id === id);
    if (idx >= 0) this.gallery.splice(idx, 1);
    return this.mock(() => undefined as void);
  }

  // ---------- Reseñas ----------

  getReviews(): Observable<Review[]> {
    if (this.baseUrl) {
      return this.http.get<Review[]>(`${this.baseUrl}/api/reviews`);
    }
    return this.mock(() => [...this.reviews]);
  }

  // ---------- Reservas ----------

  getBookings(): Observable<Booking[]> {
    if (this.baseUrl) {
      return this.http.get<Booking[]>(`${this.baseUrl}/api/bookings`);
    }
    return this.mock(() => [...this.bookings].sort(byDateDesc));
  }

  createBooking(draft: BookingDraft): Observable<Booking> {
    if (this.baseUrl) {
      return this.http.post<Booking>(`${this.baseUrl}/api/bookings`, draft);
    }
    const booking: Booking = {
      id: cryptoId('b'),
      status: 'pendiente',
      createdAt: new Date().toISOString(),
      source: 'web',
      ...draft,
    };
    this.bookings.unshift(booking);
    return this.mock(() => booking);
  }

  updateBookingStatus(id: string, status: BookingStatus): Observable<Booking> {
    if (this.baseUrl) {
      return this.http.put<Booking>(`${this.baseUrl}/api/bookings/${id}`, { status });
    }
    const idx = this.bookings.findIndex((b) => b.id === id);
    if (idx < 0) return throwError(() => new Error('Reserva no encontrada'));
    this.bookings[idx] = { ...this.bookings[idx], status };
    return this.mock(() => this.bookings[idx]);
  }

  // ---------- Auth (mock) ----------

  login(email: string, password: string): Observable<{ accessToken: string; user: User }> {
    if (this.baseUrl) {
      return this.http.post<{ accessToken: string; user: User }>(`${this.baseUrl}/api/auth/login`, {
        email,
        password,
      });
    }
    const found = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
    );
    if (!found) {
      return throwError(() => new Error('Credenciales inválidas'));
    }
    const { password: _pw, ...user } = found;
    return this.mock(() => ({
      accessToken: `mock.${user.id}.${Date.now()}`,
      user,
    }));
  }

  // ---------- Notificaciones ----------

  notifyWhatsapp(phone: string, message: string): Observable<{ ok: true }> {
    if (this.baseUrl) {
      return this.http.post<{ ok: true }>(`${this.baseUrl}/api/notify/whatsapp`, {
        phone,
        message,
      });
    }
    // In mock mode we just simulate the call. The UI also opens a wa.me link.
    return this.mock(() => ({ ok: true as const }));
  }

  // ---------- Helpers ----------

  private mock<T>(fn: () => T, ms = 250): Observable<T> {
    return defer(() => of(fn()).pipe(delay(ms)));
  }
}

function byDateDesc(a: Booking, b: Booking): number {
  return (b.date + b.time).localeCompare(a.date + a.time);
}

function cryptoId(prefix: string): string {
  const part = Math.random().toString(36).slice(2, 9);
  return `${prefix}-${Date.now().toString(36)}${part}`;
}
