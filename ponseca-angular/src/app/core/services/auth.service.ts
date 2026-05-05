import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { ApiService } from './api.service';
import { StorageService } from './storage.service';
import { AuthTokens, User, UserRole } from '../models/user.model';

const STORAGE_KEY = 'ponseca.auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly storage = inject(StorageService);

  private readonly tokensSignal = signal<AuthTokens | null>(this.restore());

  readonly user = computed(() => this.tokensSignal()?.user ?? null);
  readonly accessToken = computed(() => this.tokensSignal()?.accessToken ?? null);
  readonly isAuthenticated = computed(() => this.tokensSignal() !== null);

  hasRole(role: UserRole): boolean {
    return this.user()?.role === role;
  }

  login(email: string, password: string): Observable<AuthTokens> {
    return this.api.login(email, password).pipe(
      tap((tokens) => {
        this.tokensSignal.set(tokens);
        this.storage.set(STORAGE_KEY, tokens);
      }),
    );
  }

  logout(): void {
    this.tokensSignal.set(null);
    this.storage.remove(STORAGE_KEY);
  }

  private restore(): AuthTokens | null {
    return this.storage.get<AuthTokens>(STORAGE_KEY);
  }

  /** Internal hook used by tests to seed an authenticated session. */
  _setForTest(tokens: AuthTokens | null): void {
    this.tokensSignal.set(tokens);
  }

  /** Helper for the AuthInterceptor. */
  authHeader(): Record<string, string> {
    const token = this.accessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /** Convenience accessor for templates. */
  currentUser(): User | null {
    return this.user();
  }
}
