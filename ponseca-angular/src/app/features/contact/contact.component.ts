import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { APP_CONFIG } from '../../core/config/app-config';
import { NotificationService } from '../../core/services/notification.service';
import { SeoService } from '../../core/services/seo.service';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-hero">
      <div class="container page-hero__inner">
        <p class="section__eyebrow">Contacto y horarios</p>
        <h1>Conversemos.</h1>
        <p class="lead">
          Atendemos consultas por WhatsApp, llamada o correo. Para reservas usa el
          <a routerLink="/reservas">formulario de reservas</a> — responde más rápido.
        </p>
      </div>
    </section>

    <section class="section">
      <div class="container contact__layout">
        <div class="contact__info">
          <span class="section__eyebrow">Datos del recreo</span>
          <ul>
            <li>
              <app-icon name="map-pin" />
              <div>
                <strong>Dirección</strong>
                <span>
                  {{ config.business.address }}<br />
                  {{ config.business.city }}, {{ config.business.region }} –
                  {{ config.business.country }}
                </span>
              </div>
            </li>
            <li>
              <app-icon name="clock" />
              <div>
                <strong>Horario</strong>
                <span>{{ config.business.hoursLabel }}</span>
              </div>
            </li>
            <li>
              <app-icon name="phone" />
              <div>
                <strong>Teléfono</strong>
                <a [href]="phoneLink">{{ config.business.phoneHuman }}</a>
              </div>
            </li>
            <li>
              <app-icon name="whatsapp" />
              <div>
                <strong>WhatsApp</strong>
                <a [href]="whatsappGenericLink" target="_blank" rel="noopener">Iniciar chat</a>
              </div>
            </li>
            <li>
              <app-icon name="arrow-up-right" />
              <div>
                <strong>Email</strong>
                <a [href]="'mailto:' + config.business.email">{{ config.business.email }}</a>
              </div>
            </li>
          </ul>
        </div>

        <form
          class="contact__form"
          [formGroup]="form"
          (ngSubmit)="submit()"
          novalidate
          aria-labelledby="contact-form-title"
        >
          <h2 id="contact-form-title">Envíanos un mensaje</h2>
          <p class="muted">Te respondemos por el canal que prefieras.</p>

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
              <app-icon name="check" />
              ¡Gracias! Abrimos tu chat de WhatsApp con el mensaje listo para enviar.
            </p>
          }

          <button type="submit" class="btn btn--accent btn--block" [disabled]="form.invalid">
            <app-icon name="whatsapp" />
            Enviar por WhatsApp
          </button>
        </form>
      </div>
    </section>
  `,
  styles: `
    .page-hero {
      background: var(--c-bg-alt);
      border-bottom: 1px solid var(--c-line);
    }

    .page-hero__inner {
      padding-block: clamp(3rem, 6vw, 5rem);
      max-width: 720px;
    }

    .contact__layout {
      display: grid;
      gap: 2.5rem;
      grid-template-columns: 1fr;
      align-items: start;
    }

    @media (min-width: 880px) {
      .contact__layout {
        grid-template-columns: 1fr 1.2fr;
        gap: 4rem;
      }
    }

    .contact__info {
      border-top: 2px solid var(--c-ink);
      padding-top: 1.4rem;
    }

    .contact__info .section__eyebrow {
      margin-bottom: 1.4rem;
    }

    .contact__info ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      gap: 1.4rem;
    }

    .contact__info li {
      display: grid;
      grid-template-columns: 18px 1fr;
      gap: 0.85rem;
      color: var(--c-ink-soft);
      font-size: 0.95rem;
    }

    .contact__info app-icon {
      width: 1rem;
      height: 1rem;
      font-size: 1rem;
      color: var(--c-accent);
      margin-top: 0.2rem;
    }

    .contact__info strong {
      display: block;
      font-family: var(--font-sans);
      font-size: 0.7rem;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--c-muted);
      font-weight: 600;
      margin-bottom: 0.2rem;
    }

    .contact__form {
      background: var(--c-surface);
      border: 1px solid var(--c-line);
      padding: 1.8rem;
      border-radius: var(--radius-sm);
    }

    .contact__form h2 {
      margin: 0 0 0.4rem;
      font-size: clamp(1.4rem, 2.4vw, 1.7rem);
    }

    .contact__form .muted {
      margin: 0 0 1.4rem;
      color: var(--c-muted);
      font-size: 0.95rem;
    }

    .success-msg {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(40, 76, 59, 0.08);
      color: var(--c-forest);
      padding: 0.6rem 0.85rem;
      border-radius: var(--radius-xs);
      margin-bottom: 1rem;
      font-size: 0.9rem;
    }

    .success-msg app-icon {
      width: 1rem;
      height: 1rem;
      font-size: 1rem;
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
