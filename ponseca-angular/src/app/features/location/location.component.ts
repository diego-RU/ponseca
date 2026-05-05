import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { APP_CONFIG } from '../../core/config/app-config';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-location',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="section">
      <div class="container location">
        <header class="section__header">
          <span class="section__eyebrow">Ubicación</span>
          <h1>Cómo llegar al recreo</h1>
          <p>
            Estamos en {{ config.business.address }}, a pocos minutos del centro de
            {{ config.business.city }}. Llega en auto, taxi o transporte local.
          </p>
        </header>

        <div class="location__layout">
          <div class="location__map">
            <iframe
              [src]="mapUrl"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              title="Ubicación de Recreo Ponceca en Google Maps"
              allowfullscreen
            ></iframe>
          </div>

          <aside class="location__info card">
            <h2>Referencias locales</h2>
            <ul class="hints">
              <li><strong>Estadio Curibamba:</strong> a una cuadra.</li>
              <li><strong>Plaza de Armas de Andahuaylas:</strong> 10 minutos en taxi.</li>
              <li><strong>Aeropuerto de Andahuaylas:</strong> 25 minutos en auto.</li>
            </ul>

            <h3>Estacionamiento</h3>
            <p>Contamos con estacionamiento amplio dentro del recreo.</p>

            <h3>Llegando en transporte público</h3>
            <p>
              Toma cualquier movilidad con dirección Curibamba. Bájate en el estadio y camina menos
              de 100 metros por la Avenida Santa Cruz.
            </p>

            <a
              [href]="config.social.googleMaps"
              target="_blank"
              rel="noopener"
              class="btn btn--ghost"
            >
              Abrir en Google Maps
            </a>
          </aside>
        </div>
      </div>
    </section>
  `,
  styles: `
    .location__layout {
      display: grid;
      gap: 1.5rem;
      grid-template-columns: 1fr;
      align-items: start;
    }

    .location__map {
      border-radius: var(--radius-md);
      overflow: hidden;
      box-shadow: var(--shadow-md);
      aspect-ratio: 4 / 3;
      background: var(--color-sand);
    }

    .location__map iframe {
      width: 100%;
      height: 100%;
      border: 0;
    }

    .location__info {
      padding: 1.4rem;
    }

    .location__info h2 {
      margin-top: 0;
      font-size: 1.2rem;
    }

    .location__info h3 {
      margin: 1rem 0 0.3rem;
      font-size: 1rem;
    }

    .hints {
      padding-left: 1.1rem;
      display: grid;
      gap: 0.3rem;
    }

    @media (min-width: 880px) {
      .location__layout {
        grid-template-columns: 1.7fr 1fr;
        gap: 2rem;
      }
    }
  `,
})
export class LocationComponent implements OnInit {
  protected readonly config = APP_CONFIG;
  private readonly sanitizer = inject(DomSanitizer);
  private readonly seo = inject(SeoService);

  protected readonly mapUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    'https://www.google.com/maps?q=' +
      encodeURIComponent(
        `${APP_CONFIG.business.address}, ${APP_CONFIG.business.city}, ${APP_CONFIG.business.region}`,
      ) +
      '&output=embed',
  );

  ngOnInit(): void {
    this.seo.update({
      title: 'Cómo llegar',
      description:
        'Avenida Santa Cruz 610, ref. estadio Curibamba, Andahuaylas, Apurímac. Mapa interactivo y referencias.',
      url: 'https://recreoponceca.pe/ubicacion',
    });
  }
}
