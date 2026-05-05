import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

import { APP_CONFIG } from '../../core/config/app-config';
import { Booking } from '../../core/models/booking.model';
import { NotificationService } from '../../core/services/notification.service';
import { SeoService } from '../../core/services/seo.service';

interface NavState {
  booking?: Booking;
  message?: string;
}

@Component({
  selector: 'app-booking-success',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section">
      <div class="container success">
        <div class="success__card card">
          <div class="success__icon" aria-hidden="true">✓</div>
          <h1>¡Reserva recibida!</h1>
          @if (booking(); as b) {
            <p>
              Hola <strong>{{ b.name }}</strong
              >, registramos tu solicitud para el <strong>{{ b.date }}</strong> a las
              <strong>{{ b.time }}</strong> para <strong>{{ b.pax }}</strong> persona(s).
            </p>
            <p>
              Te confirmaremos por WhatsApp al <strong>{{ b.phone }}</strong> en breve. Si lo
              prefieres, también puedes seguir la conversación tú mismo:
            </p>
          } @else {
            <p>
              Tu solicitud está registrada. Si no la enviaste desde este dispositivo, puedes
              continuar la conversación con nosotros por WhatsApp.
            </p>
          }

          <div class="success__actions">
            <a [href]="whatsappLink()" target="_blank" rel="noopener" class="btn btn--whatsapp">
              Continuar por WhatsApp
            </a>
            <a [href]="phoneLink" class="btn btn--ghost">Llamar al recreo</a>
            <a routerLink="/" class="btn btn--secondary">Volver al inicio</a>
          </div>

          <p class="muted">
            ¿Necesitas cambiar algo? Escríbenos al
            <strong>{{ config.business.phoneHuman }}</strong
            >.
          </p>
        </div>
      </div>
    </section>
  `,
  styles: `
    .success__card {
      max-width: 720px;
      margin: 0 auto;
      padding: 2rem;
      text-align: center;
    }

    .success__icon {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: var(--color-success);
      color: #fff;
      display: grid;
      place-items: center;
      font-size: 2rem;
      margin: 0 auto 1rem;
    }

    .success__actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      justify-content: center;
      margin: 1.4rem 0 1rem;
    }

    .muted {
      color: var(--color-muted);
      font-size: 0.9rem;
    }
  `,
})
export class BookingSuccessComponent implements OnInit {
  protected readonly config = APP_CONFIG;
  private readonly notify = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly seo = inject(SeoService);

  protected readonly booking = signal<Booking | null>(null);
  protected readonly message = signal<string | null>(null);

  ngOnInit(): void {
    this.seo.update({
      title: 'Reserva confirmada',
      description: 'Tu reserva en Recreo Ponceca fue recibida. Te confirmamos por WhatsApp.',
      url: 'https://recreoponceca.pe/reservas/exito',
    });

    if (!isPlatformBrowser(this.platformId)) return;
    const state = (this.router.getCurrentNavigation()?.extras?.state ??
      (history.state as NavState | null)) as NavState | null;
    if (state?.booking) this.booking.set(state.booking);
    if (state?.message) this.message.set(state.message);
  }

  protected get phoneLink(): string {
    return this.notify.callPhone();
  }

  protected whatsappLink(): string {
    const fallback =
      'Hola Recreo Ponceca, acabo de enviar una reserva por la web. ¿Me confirman por aquí?';
    const msg = this.message() ?? fallback;
    const phone = this.booking()?.phone;
    return this.notify.whatsappLink(msg, phone ?? this.config.business.phoneWhatsapp);
  }
}
