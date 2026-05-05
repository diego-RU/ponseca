import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { APP_CONFIG } from '../../core/config/app-config';
import { SeoService } from '../../core/services/seo.service';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-hero">
      <div class="container page-hero__inner">
        <p class="section__eyebrow">Sobre nosotros</p>
        <h1>Tres generaciones cocinando con productos del valle.</h1>
        <p class="lead">
          Recreo Ponceca nació como una iniciativa familiar para compartir las recetas que han
          pasado de generación en generación en {{ config.business.city }}. Hoy somos un punto de
          encuentro para vecinos y visitantes que buscan sabor regional y un día de campo en
          familia.
        </p>
      </div>
    </section>

    <section class="section">
      <div class="container split">
        <figure>
          <img
            src="https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=900&q=80"
            alt="Cocina al aire libre del recreo"
            loading="lazy"
            decoding="async"
          />
        </figure>
        <div>
          <span class="section__eyebrow">El origen</span>
          <h2>De un puesto al borde del camino a un recreo familiar.</h2>
          <p>
            Empezamos hace más de quince años, cocinando para los viajeros que pasaban por la
            carretera a {{ config.business.city }}. Lo que empezó como una pequeña parrilla bajo un
            toldo se transformó en un recreo de campo con horno de barro, terraza con vista al valle
            y una huerta donde crecemos parte de las hierbas que usamos.
          </p>
          <p>
            Servimos lo mismo que se cocina en casa: porciones generosas, sin apuros y con
            ingredientes que sabemos de dónde vienen.
          </p>
        </div>
      </div>
    </section>

    <section class="section section--alt">
      <div class="container">
        <header class="section__header">
          <span class="section__eyebrow">Nuestros valores</span>
          <h2>Cuatro principios que repetimos cada día.</h2>
        </header>
        <ol class="values">
          <li>
            <span class="values__num">01</span>
            <h3>Producto local</h3>
            <p>
              Trabajamos con productores y agricultores de Apurímac. La trucha viene de la laguna de
              Pacucha, las papas nativas de las comunidades cercanas y la carne de productores
              locales.
            </p>
          </li>
          <li>
            <span class="values__num">02</span>
            <h3>Cocina con tiempo</h3>
            <p>
              Cocinamos a fuego lento, en horno de barro y a la brasa. Nada se sirve apurado: cada
              plato respeta los tiempos de la tradición.
            </p>
          </li>
          <li>
            <span class="values__num">03</span>
            <h3>Espacios para todos</h3>
            <p>
              Áreas verdes, mirador, zona infantil y estacionamiento amplio. Pensado para almorzar
              en familia, celebrar eventos o simplemente desconectarte un rato.
            </p>
          </li>
          <li>
            <span class="values__num">04</span>
            <h3>Atención cercana</h3>
            <p>
              Nuestro equipo te recibe con calidez y resuelve tu reserva por el canal que prefieras:
              WhatsApp, llamada o el formulario web.
            </p>
          </li>
        </ol>
      </div>
    </section>

    <section class="section">
      <div class="container cta-row">
        <a routerLink="/menu" class="btn btn--ghost">
          Ver la carta
          <app-icon name="arrow-right" />
        </a>
        <a routerLink="/reservas" class="btn btn--accent">
          Hacer una reserva
          <app-icon name="arrow-right" />
        </a>
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

    .split {
      display: grid;
      gap: 3rem;
      align-items: center;
    }

    @media (min-width: 880px) {
      .split {
        grid-template-columns: 0.95fr 1fr;
      }
    }

    .split figure {
      margin: 0;
      aspect-ratio: 4 / 5;
      border-radius: var(--radius-md);
      overflow: hidden;
      background: var(--c-bg-alt);
    }

    .split img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .values {
      list-style: none;
      counter-reset: values;
      margin: 0;
      padding: 0;
      display: grid;
      gap: 0;
      border-top: 1px solid var(--c-line);
    }

    @media (min-width: 760px) {
      .values {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .values li {
      padding: 1.8rem 1.4rem 2rem;
      border-bottom: 1px solid var(--c-line);
    }

    @media (min-width: 760px) {
      .values li:nth-child(odd) {
        border-right: 1px solid var(--c-line);
      }
    }

    .values__num {
      font-family: var(--font-serif);
      font-size: 0.95rem;
      letter-spacing: 0.1em;
      color: var(--c-accent);
      display: inline-block;
      margin-bottom: 0.85rem;
    }

    .values h3 {
      margin: 0 0 0.5rem;
      font-family: var(--font-serif);
      font-weight: 500;
      font-size: 1.25rem;
      letter-spacing: -0.01em;
    }

    .values p {
      margin: 0;
      max-width: 50ch;
      color: var(--c-muted);
    }

    .cta-row {
      display: flex;
      gap: 0.85rem;
      flex-wrap: wrap;
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
