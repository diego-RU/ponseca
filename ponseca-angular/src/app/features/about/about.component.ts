import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { APP_CONFIG } from '../../core/config/app-config';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="hero hero--compact">
      <div class="container">
        <span class="section__eyebrow">Nuestra historia</span>
        <h1>Tradición, familia y sabor andino</h1>
        <p class="lead">
          Recreo Ponceca nació como una iniciativa familiar para compartir las recetas que se han
          pasado de generación en generación en {{ config.business.city }}. Hoy, somos un punto de
          encuentro para vecinos y visitantes que buscan sabor regional y un espacio para disfrutar
          en familia.
        </p>
      </div>
    </section>

    <section class="section">
      <div class="container values">
        <article class="value card">
          <h2>Producto local</h2>
          <p>
            Trabajamos con productores y agricultores de Apurímac. La trucha viene de la laguna de
            Pacucha, las papas nativas de las comunidades cercanas y la carne de productores
            locales.
          </p>
        </article>
        <article class="value card">
          <h2>Cocina con tiempo</h2>
          <p>
            Cocinamos a fuego lento, en horno de barro y a la brasa. Nada se sirve apurado: cada
            plato respeta los tiempos de la tradición.
          </p>
        </article>
        <article class="value card">
          <h2>Espacios para todos</h2>
          <p>
            Áreas verdes, mirador, zona infantil y estacionamiento amplio. Pensado para almorzar en
            familia, celebrar eventos o simplemente desconectarte un rato.
          </p>
        </article>
        <article class="value card">
          <h2>Atención cercana</h2>
          <p>
            Nuestro equipo te recibe con calidez y resuelve tu reserva por el canal que prefieras:
            WhatsApp, llamada o nuestro formulario web.
          </p>
        </article>
      </div>

      <div class="container cta-row">
        <a routerLink="/menu" class="btn btn--ghost">Ver el menú</a>
        <a routerLink="/reservas" class="btn">Hacer una reserva</a>
      </div>
    </section>
  `,
  styles: `
    .hero--compact {
      background: var(--color-sand);
      color: var(--color-ink);
      padding-block: clamp(3rem, 6vw, 5rem);
    }

    .hero--compact .lead {
      max-width: 720px;
      font-size: 1.05rem;
    }

    .values {
      display: grid;
      gap: 1.2rem;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    }

    .value {
      padding: 1.4rem;
    }

    .value h2 {
      font-size: 1.2rem;
      margin-bottom: 0.4rem;
    }

    .value p {
      margin: 0;
    }

    .cta-row {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
      justify-content: center;
      margin-top: 2.5rem;
    }
  `,
})
export class AboutComponent implements OnInit {
  protected readonly config = APP_CONFIG;
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.update({
      title: 'Sobre nosotros',
      description:
        'Recreo Ponceca: historia, valores locales y cocina tradicional en Andahuaylas, Apurímac.',
      url: 'https://recreoponceca.pe/nosotros',
    });
  }
}
