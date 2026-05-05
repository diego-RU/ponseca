import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

import { APP_CONFIG } from '../../core/config/app-config';
import { Booking } from '../../core/models/booking.model';
import { NotificationService } from '../../core/services/notification.service';
import { SeoService } from '../../core/services/seo.service';
import { IconComponent } from '../../shared/components/icon/icon.component';

interface NavState {
  booking?: Booking;
  message?: string;
}

@Component({
  selector: 'app-booking-success',
  standalone: true,
  imports: [RouterLink, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section">
      <div class="container success">
        <div class="success__card">
          <div class="success__icon" aria-hidden="true">
            <app-icon name="check" />
          </div>
          <p class="section__eyebrow">Solicitud registrada</p>
          <h1>Reserva recibida.</h1>
          @if (booking(); as b) {
            <p>
              Hola <strong>{{ b.name }}</strong
              >, registramos tu solicitud para el <strong>{{ b.date }}</strong> a las
              <strong>{{ b.time }}</strong> para <strong>{{ b.pax }}</strong> persona(s).
            </p>
            <p>
              Te confirmamos por WhatsApp al <strong>{{ b.phone }}</strong> en breve. Si lo
              prefieres, sigue tú mismo la conversación:
            </p>
          } @else {
            <p>
              Tu solicitud está registrada. Si no la enviaste desde este dispositivo, puedes
              continuar la conversación con nosotros por WhatsApp.
            </p>
          }

          <div class="success__actions">
            <a [href]="whatsappLink()" target="_blank" rel="noopener" class="btn btn--whatsapp">
              <app-icon name="whatsapp" />
              Continuar por WhatsApp
            </a>
            <a [href]="phoneLink" class="btn btn--ghost">
              <app-icon name="phone" />
              Llamar al recreo
            </a>
            <a routerLink="/" class="btn btn--link">
              Volver al inicio
              <app-icon name="arrow-right" />
            </a>
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
      max-width: 680px;
      margin: 0 auto;
      padding: 2.6rem 1rem;
      text-align: center;
    }

    .success__icon {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: var(--c-ink);
      color: #fff;
      display: grid;
      place-items: center;
      margin: 0 auto 1.6rem;
    }

    .success__icon app-icon {
      width: 1.5rem;
      height: 1.5rem;
      font-size: 1.5rem;
    }

    .success__card .section__eyebrow {
      justify-content: center;
    }

    .success__actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      justify-content: center;
      margin: 2rem 0 1.6rem;
      border-top: 1px solid var(--c-line);
      border-bottom: 1px solid var(--c-line);
      padding: 1.6rem 0;
    }

    .muted {
      color: var(--c-muted);
      font-size: 0.92rem;
      margin: 0;
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
