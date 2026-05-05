import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { Booking, BookingStatus } from '../../../core/models/booking.model';
import { BookingService } from '../../../core/services/booking.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-header">
      <div>
        <h1>Reservas</h1>
        <p>Confirma, cancela o contacta al cliente con un clic.</p>
      </div>
      <div class="filters">
        @for (s of statuses; track s) {
          <button
            type="button"
            class="filter"
            [class.is-active]="filter() === s"
            (click)="setFilter(s)"
          >
            {{ s | titlecase }}
          </button>
        }
      </div>
    </header>

    <div class="table card">
      <div class="table__head">
        <span>Fecha</span>
        <span>Cliente</span>
        <span>Personas</span>
        <span>Estado</span>
        <span>Acciones</span>
      </div>

      @for (b of visible(); track b.id) {
        <div class="table__row">
          <div>
            <strong>{{ b.date }}</strong>
            <span class="muted">{{ b.time }}</span>
          </div>
          <div>
            <strong>{{ b.name }}</strong>
            <a class="muted small" [href]="'tel:' + b.phone">{{ b.phone }}</a>
            @if (b.notes) {
              <small class="notes">{{ b.notes }}</small>
            }
          </div>
          <div>{{ b.pax }}</div>
          <div>
            <span class="status status--{{ b.status }}">{{ b.status }}</span>
          </div>
          <div class="actions">
            @if (b.status !== 'confirmada') {
              <button type="button" class="btn btn--sm" (click)="setStatus(b, 'confirmada')">
                Confirmar
              </button>
            }
            @if (b.status !== 'cancelada') {
              <button
                type="button"
                class="btn btn--sm btn--ghost"
                (click)="setStatus(b, 'cancelada')"
              >
                Cancelar
              </button>
            }
            <a
              class="btn btn--sm btn--whatsapp"
              [href]="whatsappFor(b)"
              target="_blank"
              rel="noopener"
            >
              WhatsApp
            </a>
          </div>
        </div>
      } @empty {
        <p class="empty">No hay reservas con este estado.</p>
      }
    </div>
  `,
  styles: `
    .page-header {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .page-header h1 {
      margin-bottom: 0.2rem;
    }

    .filters {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
    }

    .filter {
      background: #fff;
      border: 1px solid var(--color-line);
      padding: 0.4rem 0.9rem;
      border-radius: var(--radius-pill);
      font-size: 0.85rem;
      font-weight: 500;
    }

    .filter.is-active {
      background: var(--color-primary);
      color: #fff;
      border-color: var(--color-primary);
    }

    .table {
      padding: 0.5rem;
    }

    .table__head {
      display: none;
      padding: 0.6rem 1rem;
      font-weight: 600;
      color: var(--color-muted);
      letter-spacing: 0.05em;
      text-transform: uppercase;
      font-size: 0.75rem;
    }

    .table__row {
      display: grid;
      gap: 0.4rem;
      padding: 0.85rem 1rem;
      border-radius: var(--radius-sm);
      grid-template-columns: 1fr;
    }

    .table__row + .table__row {
      border-top: 1px solid var(--color-line);
    }

    .table__row strong {
      display: block;
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
    }

    .status {
      display: inline-block;
      padding: 0.15rem 0.6rem;
      border-radius: var(--radius-pill);
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: capitalize;
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
    .small {
      font-size: 0.85rem;
    }
    .notes {
      display: block;
      font-size: 0.8rem;
      color: var(--color-muted);
      margin-top: 0.2rem;
    }

    .empty {
      padding: 1.5rem;
      text-align: center;
      color: var(--color-muted);
    }

    @media (min-width: 880px) {
      .table__head,
      .table__row {
        grid-template-columns: 1fr 1.6fr 0.6fr 1fr 1.4fr;
        align-items: center;
      }
      .table__head {
        display: grid;
      }
      .actions {
        justify-content: flex-start;
      }
    }
  `,
  imports: [TitleCasePipe],
})
export class AdminBookingsComponent {
  private readonly bookings = inject(BookingService);
  private readonly notify = inject(NotificationService);

  protected readonly statuses: Array<'todos' | BookingStatus> = [
    'todos',
    'pendiente',
    'confirmada',
    'cancelada',
    'completada',
  ];

  protected readonly filter = signal<'todos' | BookingStatus>('todos');

  private readonly listSignal = signal<Booking[]>([]);
  private readonly initial = toSignal(this.bookings.list(), { initialValue: [] as Booking[] });

  constructor() {
    // Seed local mutable copy from the initial fetch.
    queueMicrotask(() => this.listSignal.set(this.initial()));
  }

  protected readonly visible = computed(() => {
    const f = this.filter();
    const list = this.listSignal();
    return f === 'todos' ? list : list.filter((b) => b.status === f);
  });

  setFilter(value: 'todos' | BookingStatus): void {
    this.filter.set(value);
  }

  setStatus(booking: Booking, status: BookingStatus): void {
    this.bookings.setStatus(booking.id, status).subscribe((updated) => {
      this.listSignal.update((arr) => arr.map((b) => (b.id === updated.id ? updated : b)));
    });
  }

  whatsappFor(b: Booking): string {
    const message =
      b.status === 'confirmada'
        ? `Hola ${b.name}, te confirmamos tu reserva en Recreo Ponceca para el ${b.date} a las ${b.time}.`
        : `Hola ${b.name}, te escribimos de Recreo Ponceca acerca de tu reserva del ${b.date} a las ${b.time}.`;
    return this.notify.whatsappLink(message, b.phone);
  }
}
