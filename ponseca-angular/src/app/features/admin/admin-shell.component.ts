import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="admin">
      <aside class="admin__sidebar" aria-label="Navegación administrativa">
        <div class="admin__brand">
          <span class="admin__mark" aria-hidden="true">RP</span>
          <div>
            <strong>Panel interno</strong>
            <small>{{ user()?.role }}</small>
          </div>
        </div>
        <nav>
          <ul>
            <li>
              <a
                routerLink="/admin"
                routerLinkActive="is-active"
                [routerLinkActiveOptions]="{ exact: true }"
              >
                Resumen
              </a>
            </li>
            <li>
              <a routerLink="/admin/reservas" routerLinkActive="is-active">Reservas</a>
            </li>
            @if (isAdmin()) {
              <li>
                <a routerLink="/admin/menu" routerLinkActive="is-active">Carta</a>
              </li>
              <li>
                <a routerLink="/admin/galeria" routerLinkActive="is-active">Galería</a>
              </li>
            }
          </ul>
        </nav>
        <div class="admin__user">
          <div>
            <strong>{{ user()?.name }}</strong>
            <small>{{ user()?.email }}</small>
          </div>
          <button type="button" class="btn btn--ghost btn--sm" (click)="logout()">
            Salir
            <app-icon name="arrow-right" />
          </button>
        </div>
      </aside>

      <div class="admin__content">
        <router-outlet />
      </div>
    </section>
  `,
  styles: `
    :host {
      display: block;
      background: var(--c-bg);
    }

    .admin {
      display: grid;
      gap: 0;
      grid-template-columns: 1fr;
      min-height: calc(100vh - 80px);
    }

    .admin__sidebar {
      background: var(--c-surface);
      border-bottom: 1px solid var(--c-line);
      padding: 1.4rem 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.4rem;
    }

    .admin__brand {
      display: flex;
      align-items: center;
      gap: 0.85rem;
    }

    .admin__mark {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: var(--c-ink);
      color: #f5efe1;
      display: grid;
      place-items: center;
      font-family: var(--font-serif);
      font-weight: 600;
      font-size: 0.95rem;
      letter-spacing: 0.04em;
    }

    .admin__brand strong {
      display: block;
      font-family: var(--font-serif);
      font-size: 1.05rem;
      letter-spacing: -0.01em;
      color: var(--c-ink);
    }

    .admin__brand small {
      color: var(--c-muted);
      text-transform: uppercase;
      letter-spacing: 0.18em;
      font-size: 0.65rem;
    }

    .admin__sidebar nav ul {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-wrap: wrap;
      gap: 0.3rem;
    }

    .admin__sidebar nav a {
      display: inline-block;
      padding: 0.5rem 0.95rem;
      border-radius: var(--radius-pill);
      color: var(--c-muted);
      background: transparent;
      font-family: var(--font-sans);
      font-weight: 500;
      font-size: 0.82rem;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      border: 1px solid transparent;
      transition:
        color 0.18s ease,
        background 0.18s ease,
        border-color 0.18s ease;
    }

    .admin__sidebar nav a:hover,
    .admin__sidebar nav a:focus-visible {
      color: var(--c-ink);
      background: rgba(28, 26, 23, 0.04);
    }

    .admin__sidebar nav a.is-active {
      background: var(--c-ink);
      color: #f5efe1;
      border-color: var(--c-ink);
    }

    .admin__user {
      display: flex;
      gap: 0.75rem;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      border-top: 1px solid var(--c-line);
      padding-top: 1.1rem;
    }

    .admin__user strong {
      font-family: var(--font-serif);
      font-size: 0.95rem;
      color: var(--c-ink);
    }

    .admin__user small {
      display: block;
      color: var(--c-muted);
      font-size: 0.78rem;
    }

    .admin__content {
      padding: 2rem 1.5rem;
    }

    @media (min-width: 960px) {
      .admin {
        grid-template-columns: 260px 1fr;
      }
      .admin__sidebar {
        border-right: 1px solid var(--c-line);
        border-bottom: 0;
        position: sticky;
        top: 80px;
        height: calc(100vh - 80px);
        align-self: start;
      }
      .admin__sidebar nav ul {
        flex-direction: column;
        gap: 0.15rem;
      }
      .admin__sidebar nav a {
        display: block;
        text-align: left;
      }
      .admin__content {
        padding: 2.5rem 2.5rem;
      }
    }
  `,
})
export class AdminShellComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly user = computed(() => this.auth.user());
  protected readonly isAdmin = computed(() => this.auth.hasRole('admin'));

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/');
  }
}
