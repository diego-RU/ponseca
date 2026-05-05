import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { APP_CONFIG } from '../../core/config/app-config';
import { NotificationService } from '../../core/services/notification.service';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section">
      <div class="container contact">
        <header class="section__header">
          <span class="section__eyebrow">Contacto y horarios</span>
          <h1>¿En qué te ayudamos?</h1>
          <p>
            Atendemos consultas por WhatsApp, llamada o correo. Para reservas usa el
            <a routerLink="/reservas">formulario de reservas</a>.
          </p>
        </header>

        <div class="contact__layout">
          <div class="contact__info card">
            <h2>Datos del recreo</h2>
            <ul>
              <li>
                <strong>Dirección:</strong>
                {{ config.business.address }}, {{ config.business.city }},
                {{ config.business.region }}
              </li>
              <li><strong>Horario:</strong> {{ config.business.hoursLabel }}</li>
              <li>
                <strong>Teléfono:</strong>
                <a [href]="phoneLink">{{ config.business.phoneHuman }}</a>
              </li>
              <li>
                <strong>WhatsApp:</strong>
                <a [href]="whatsappGenericLink" target="_blank" rel="noopener">Iniciar chat</a>
              </li>
              <li>
                <strong>Email:</strong>
                <a [href]="'mailto:' + config.business.email">{{ config.business.email }}</a>
              </li>
            </ul>
          </div>

          <form
            class="contact__form card"
            [formGroup]="form"
            (ngSubmit)="submit()"
            novalidate
            aria-labelledby="contact-form-title"
          >
            <h2 id="contact-form-title">Envíanos un mensaje</h2>

            <div class="form-field">
              <label for="c-name">Tu nombre *</label>
              <input id="c-name" formControlName="name" autocomplete="name" required />
            </div>

            <div class="form-field">
              <label for="c-email">Email o teléfono</label>
              <input id="c-email" formControlName="contact" autocomplete="tel" />
            </div>

            <div class="form-field">
              <label for="c-msg">Tu mensaje *</label>
              <textarea
                id="c-msg"
                rows="4"
                formControlName="message"
                required
                maxlength="500"
              ></textarea>
            </div>

            @if (sent()) {
              <p class="success-msg" role="status">
                ¡Gracias! Abrimos tu chat de WhatsApp con el mensaje listo para enviar.
              </p>
            }

            <button type="submit" class="btn btn--block" [disabled]="form.invalid">
              Enviar por WhatsApp
            </button>
          </form>
        </div>
      </div>
    </section>
  `,
  styles: `
    .contact__layout {
      display: grid;
      gap: 1.5rem;
      grid-template-columns: 1fr;
      align-items: start;
    }

    .contact__info,
    .contact__form {
      padding: 1.4rem;
    }

    .contact__info ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      gap: 0.6rem;
    }

    .success-msg {
      background: rgba(47, 111, 78, 0.12);
      color: var(--color-accent-dark);
      padding: 0.6rem 0.8rem;
      border-radius: var(--radius-sm);
      margin-bottom: 0.75rem;
    }

    @media (min-width: 880px) {
      .contact__layout {
        grid-template-columns: 1fr 1.2fr;
        gap: 2rem;
      }
    }
  `,
})
export class ContactComponent implements OnInit {
  protected readonly config = APP_CONFIG;
  private readonly fb = inject(FormBuilder);
  private readonly notify = inject(NotificationService);
  private readonly seo = inject(SeoService);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    contact: [''],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
  });

  protected readonly sent = signal(false);

  ngOnInit(): void {
    this.seo.update({
      title: 'Contacto',
      description: 'Contacta con Recreo Ponceca por teléfono, WhatsApp o correo electrónico.',
      url: 'https://recreoponceca.pe/contacto',
    });
  }

  protected get phoneLink(): string {
    return this.notify.callPhone();
  }

  protected get whatsappGenericLink(): string {
    return this.notify.whatsappLink('Hola Recreo Ponceca, tengo una consulta.');
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const message = `Hola, soy ${v.name}. ${v.message}` + (v.contact ? ` (${v.contact})` : '');
    this.notify.openWhatsapp(message);
    this.sent.set(true);
  }
}
