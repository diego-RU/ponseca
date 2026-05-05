import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { Booking } from '../../../core/models/booking.model';
import { BookingService } from '../../../core/services/booking.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="dashboard__header">
      <h1>Hola, {{ userName() }}</h1>
      <p>Resumen del recreo y próximas reservas.</p>
    </header>

    <div class="stats">
      <article class="stat card">
        <small>Reservas registradas</small>
        <strong>{{ totalBookings() }}</strong>
      </article>
      <article class="stat card">
        <small>Pendientes de confirmar</small>
        <strong>{{ pending() }}</strong>
      </article>
      <article class="stat card">
        <small>Confirmadas próximas 7 días</small>
        <strong>{{ upcoming() }}</strong>
      </article>
    </div>

    <section class="next card">
      <header>
        <h2>Próximas reservas</h2>
        <a routerLink="/admin/reservas" class="btn btn--ghost btn--sm">Ver todas</a>
      </header>
      <ul>
        @for (b of upcomingList(); track b.id) {
          <li>
            <strong>{{ b.date }} · {{ b.time }}</strong>
            <span>{{ b.name }} · {{ b.pax }} pax</span>
            <span class="status status--{{ b.status }}">{{ b.status }}</span>
          </li>
        } @empty {
          <li class="muted">No hay reservas próximas.</li>
        }
      </ul>
    </section>
  `,
  styles: `
    .dashboard__header h1 {
      margin-bottom: 0.2rem;
    }

    .stats {
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      margin: 1.5rem 0;
    }

    .stat {
      padding: 1rem 1.2rem;
    }

    .stat small {
      color: var(--color-muted);
      letter-spacing: 0.05em;
      text-transform: uppercase;
      font-size: 0.75rem;
    }

    .stat strong {
      display: block;
      font-size: 1.8rem;
      color: var(--color-primary-dark);
    }

    .next {
      padding: 1.2rem;
    }

    .next header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.8rem;
    }

    .next h2 {
      margin: 0;
      font-size: 1.15rem;
    }

    .next ul {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      gap: 0.5rem;
    }

    .next li {
      display: grid;
      gap: 0.3rem;
      padding: 0.7rem 0.8rem;
      background: var(--color-cream);
      border-radius: var(--radius-sm);
      grid-template-columns: 1fr;
    }

    .status {
      justify-self: start;
      padding: 0.15rem 0.6rem;
      border-radius: var(--radius-pill);
      font-size: 0.75rem;
      text-transform: capitalize;
      font-weight: 600;
    }

    .status--confirmada {
      background: rgba(47, 111, 78, 0.15);
      color: var(--color-accent-dark);
    }
    .status--pendiente {
      background: rgba(210, 138, 44, 0.18);
      color: #8a5210;
    }
    .status--cancelada {
      background: rgba(179, 51, 26, 0.15);
      color: var(--color-danger);
    }
    .status--completada {
      background: rgba(31, 26, 23, 0.1);
      color: var(--color-ink);
    }

    .muted {
      color: var(--color-muted);
    }

    @media (min-width: 720px) {
      .next li {
        grid-template-columns: 1fr 2fr auto;
        align-items: center;
      }
    }
  `,
})
export class AdminDashboardComponent {
  private readonly auth = inject(AuthService);
  private readonly bookings = inject(BookingService);

  protected readonly userName = computed(() => this.auth.user()?.name ?? '');

  private readonly bookingsSignal = toSignal(this.bookings.list(), {
    initialValue: [] as Booking[],
  });

  protected readonly totalBookings = computed(() => this.bookingsSignal().length);
  protected readonly pending = computed(
    () => this.bookingsSignal().filter((b) => b.status === 'pendiente').length,
  );
  protected readonly upcoming = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const limit = new Date(today);
    limit.setDate(limit.getDate() + 7);
    return this.bookingsSignal().filter((b) => {
      const d = new Date(b.date + 'T00:00:00');
      return b.status === 'confirmada' && d >= today && d <= limit;
    }).length;
  });
  protected readonly upcomingList = computed(() =>
    [...this.bookingsSignal()]
      .filter((b) => b.status !== 'cancelada' && b.status !== 'completada')
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
      .slice(0, 5),
  );
}
