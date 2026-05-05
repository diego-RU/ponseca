import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="admin">
      <aside class="admin__sidebar" aria-label="Navegación administrativa">
        <div class="admin__brand">
          <strong>Panel</strong>
          <small>{{ user()?.role }}</small>
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
                <a routerLink="/admin/menu" routerLinkActive="is-active">Menú</a>
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
          <button type="button" class="btn btn--ghost btn--sm" (click)="logout()">Salir</button>
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
      background: var(--color-sand);
    }

    .admin {
      display: grid;
      gap: 0;
      grid-template-columns: 1fr;
      min-height: calc(100vh - 80px);
    }

    .admin__sidebar {
      background: #fff;
      border-bottom: 1px solid var(--color-line);
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .admin__brand {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
    }

    .admin__brand small {
      color: var(--color-muted);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-size: 0.7rem;
    }

    .admin__sidebar nav ul {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
    }

    .admin__sidebar nav a {
      display: inline-block;
      padding: 0.45rem 0.9rem;
      border-radius: var(--radius-pill);
      color: var(--color-ink-soft);
      background: rgba(31, 26, 23, 0.05);
      font-weight: 500;
      font-size: 0.9rem;
    }

    .admin__sidebar nav a.is-active {
      background: var(--color-primary);
      color: #fff;
    }

    .admin__user {
      display: flex;
      gap: 0.75rem;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
    }

    .admin__user small {
      display: block;
      color: var(--color-muted);
      font-size: 0.8rem;
    }

    .admin__content {
      padding: 1.5rem;
    }

    @media (min-width: 880px) {
      .admin {
        grid-template-columns: 240px 1fr;
      }
      .admin__sidebar {
        border-right: 1px solid var(--color-line);
        border-bottom: 0;
        position: sticky;
        top: 80px;
        height: calc(100vh - 80px);
      }
      .admin__sidebar nav ul {
        flex-direction: column;
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
