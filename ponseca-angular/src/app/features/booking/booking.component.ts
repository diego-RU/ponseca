import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { APP_CONFIG } from '../../core/config/app-config';
import { BookingService } from '../../core/services/booking.service';
import { NotificationService } from '../../core/services/notification.service';
import { SeoService } from '../../core/services/seo.service';
import { IconComponent } from '../../shared/components/icon/icon.component';

function futureDateValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value as string | null;
  if (!value) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const picked = new Date(value + 'T00:00:00');
  return picked >= today ? null : { pastDate: true };
}

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [ReactiveFormsModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css',
})
export class BookingComponent implements OnInit {
  protected readonly config = APP_CONFIG;

  private readonly fb = inject(FormBuilder);
  private readonly bookings = inject(BookingService);
  private readonly notify = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);

  protected readonly today = new Date().toISOString().slice(0, 10);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(80)]],
    phone: ['', [Validators.required, Validators.pattern(/^(\+?51)?\s?\d{6,9}([\s-]?\d{0,4})$/)]],
    email: ['', [Validators.email]],
    date: [this.today, [Validators.required, futureDateValidator]],
    time: ['12:00', [Validators.required]],
    pax: [
      2,
      [
        Validators.required,
        Validators.min(APP_CONFIG.reservations.minPax),
        Validators.max(APP_CONFIG.reservations.maxPax),
      ],
    ],
    notes: ['', [Validators.maxLength(280)]],
  });

  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.seo.update({
      title: 'Reservas y eventos',
      description:
        'Reserva tu mesa o coordina un evento en Recreo Ponceca. Confirmamos por WhatsApp o llamada.',
      url: 'https://recreoponceca.pe/reservas',
    });
  }

  protected get f() {
    return this.form.controls;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);

    const value = this.form.getRawValue();

    this.bookings.create(value).subscribe({
      next: (booking) => {
        const message =
          `Hola ${booking.name}, somos Recreo Ponceca. ` +
          `Hemos recibido tu reserva para el ${booking.date} a las ${booking.time} ` +
          `para ${booking.pax} persona(s). Pronto te confirmamos por este medio. ¡Gracias!`;
        // Server-side notify (mock-friendly).
        this.notify.notifyWhatsapp(booking.phone, message).subscribe();
        this.router.navigate(['/reservas/exito'], {
          state: { booking, message },
        });
      },
      error: () => {
        this.submitting.set(false);
        this.errorMessage.set(
          'No pudimos crear la reserva. Intenta nuevamente o escríbenos por WhatsApp.',
        );
      },
    });
  }

  whatsappFallback(): string {
    const v = this.form.getRawValue();
    const msg =
      `Hola Recreo Ponceca, soy ${v.name || '...'}. ` +
      `Quisiera reservar el ${v.date} a las ${v.time} para ${v.pax} persona(s).` +
      (v.notes ? ` Detalle: ${v.notes}` : '');
    return this.notify.whatsappLink(msg);
  }
}
