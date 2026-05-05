import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { APP_CONFIG } from '../../core/config/app-config';
import { SeoService } from '../../core/services/seo.service';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-hero">
      <div class="container page-hero__inner">
        <p class="section__eyebrow">Cómo llegar</p>
        <h1>{{ config.business.address }}.</h1>
        <p class="lead">
          Estamos a pocos minutos del centro de {{ config.business.city }}. Llega en auto, taxi o
          cualquier movilidad con dirección Curibamba.
        </p>
      </div>
    </section>

    <section class="section">
      <div class="container location__layout">
        <div class="location__map">
          <iframe
            [src]="mapUrl"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            title="Ubicación de Recreo Ponceca en Google Maps"
            allowfullscreen
          ></iframe>
        </div>

        <aside class="location__info">
          <div class="location__info-card">
            <span class="section__eyebrow">Referencias</span>
            <ul class="hints">
              <li>
                <span class="hints__bullet">·</span>
                <span><strong>Estadio Curibamba</strong><br />a una cuadra del recreo.</span>
              </li>
              <li>
                <span class="hints__bullet">·</span>
                <span
                  ><strong>Plaza de Armas de {{ config.business.city }}</strong
                  ><br />10 minutos en taxi.</span
                >
              </li>
              <li>
                <span class="hints__bullet">·</span>
                <span
                  ><strong>Aeropuerto de {{ config.business.city }}</strong
                  ><br />25 minutos en auto.</span
                >
              </li>
            </ul>
          </div>

          <div class="location__info-card">
            <span class="section__eyebrow">En transporte público</span>
            <p>
              Toma cualquier movilidad con dirección Curibamba. Bájate en el estadio y camina menos
              de 100 metros por la {{ config.business.address }}.
            </p>
            <p class="muted">
              <app-icon name="parking" />
              Estacionamiento amplio dentro del recreo.
            </p>
          </div>

          <a
            [href]="config.social.googleMaps"
            target="_blank"
            rel="noopener"
            class="btn btn--accent"
          >
            <app-icon name="map-pin" />
            Abrir en Google Maps
          </a>
        </aside>
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
      max-width: 760px;
    }

    .location__layout {
      display: grid;
      gap: 2.5rem;
      grid-template-columns: 1fr;
      align-items: start;
    }

    @media (min-width: 880px) {
      .location__layout {
        grid-template-columns: 1.7fr 1fr;
        gap: 3rem;
      }
    }

    .location__map {
      border-radius: var(--radius-sm);
      overflow: hidden;
      aspect-ratio: 4 / 3;
      background: var(--c-bg-alt);
      border: 1px solid var(--c-line);
    }

    .location__map iframe {
      width: 100%;
      height: 100%;
      border: 0;
    }

    .location__info {
      display: flex;
      flex-direction: column;
      gap: 1.4rem;
    }

    .location__info-card {
      border-top: 2px solid var(--c-ink);
      padding-top: 1.4rem;
    }

    .location__info-card .section__eyebrow {
      margin-bottom: 1rem;
    }

    .hints {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      gap: 1rem;
      font-size: 0.95rem;
      color: var(--c-ink-soft);
    }

    .hints li {
      display: grid;
      grid-template-columns: 18px 1fr;
      gap: 0.8rem;
    }

    .hints__bullet {
      font-family: var(--font-serif);
      color: var(--c-accent);
    }

    .hints strong {
      color: var(--c-ink);
      font-weight: 500;
    }

    .muted {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      color: var(--c-muted);
      font-size: 0.9rem;
      margin: 0.6rem 0 0;
    }

    .muted app-icon {
      width: 1rem;
      height: 1rem;
      font-size: 1rem;
      color: var(--c-accent);
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
