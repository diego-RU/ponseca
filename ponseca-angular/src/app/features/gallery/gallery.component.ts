import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { GalleryImage } from '../../core/models/gallery-image.model';
import { GalleryService } from '../../core/services/gallery.service';
import { SeoService } from '../../core/services/seo.service';

type Filter = 'todos' | GalleryImage['category'];

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="page-hero">
      <div class="container page-hero__inner">
        <p class="section__eyebrow">Galería</p>
        <h1>El recreo, en fotos.</h1>
        <p class="lead">
          Áreas verdes, terraza con mirador, platos del día y celebraciones. Síguenos en redes para
          ver más, o ven a vivir la experiencia.
        </p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="filters" role="tablist" aria-label="Filtrar fotos por categoría">
          @for (f of filters; track f.id) {
            <button
              type="button"
              role="tab"
              [attr.aria-selected]="active() === f.id"
              [ngClass]="{ 'is-active': active() === f.id }"
              class="filter"
              (click)="setFilter(f.id)"
            >
              {{ f.label }}
            </button>
          }
        </div>

        <div class="grid">
          @for (img of visible(); track img.id; let i = $index) {
            <figure class="grid__item" [attr.data-span]="span(i)">
              <img
                [src]="img.url"
                [alt]="img.alt"
                loading="lazy"
                decoding="async"
                width="1000"
                height="800"
              />
              <figcaption>
                <span class="grid__num">{{ '0' + (i + 1) }}</span>
                <span>{{ img.alt }}</span>
              </figcaption>
            </figure>
          } @empty {
            <p class="muted">Aún no hay fotos en esta categoría.</p>
          }
        </div>
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

    .filters {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin-bottom: 2.5rem;
      border-bottom: 1px solid var(--c-line);
      padding-bottom: 0.7rem;
    }

    .filter {
      background: transparent;
      border: 0;
      color: var(--c-muted);
      padding: 0.5rem 0.85rem;
      font-family: var(--font-sans);
      font-size: 0.82rem;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      font-weight: 500;
      border-radius: var(--radius-pill);
      transition:
        color 0.18s ease,
        background 0.18s ease;
    }

    .filter:hover,
    .filter:focus-visible {
      color: var(--c-ink);
    }

    .filter.is-active {
      color: var(--c-ink);
      background: rgba(28, 26, 23, 0.06);
    }

    .grid {
      display: grid;
      gap: 1.4rem;
      grid-template-columns: 1fr;
    }

    @media (min-width: 700px) {
      .grid {
        grid-template-columns: repeat(6, 1fr);
        grid-auto-rows: minmax(220px, auto);
      }

      .grid__item {
        grid-column: span 3;
      }

      .grid__item[data-span='wide'] {
        grid-column: span 4;
      }

      .grid__item[data-span='narrow'] {
        grid-column: span 2;
      }
    }

    .grid__item {
      position: relative;
      margin: 0;
      overflow: hidden;
      border-radius: var(--radius-xs);
      background: var(--c-bg-alt);
    }

    .grid__item img {
      width: 100%;
      height: 100%;
      aspect-ratio: 4 / 3;
      object-fit: cover;
      display: block;
      transition: transform 0.6s ease;
    }

    .grid__item:hover img {
      transform: scale(1.04);
    }

    .grid__item figcaption {
      position: absolute;
      left: 0.95rem;
      bottom: 0.95rem;
      right: 0.95rem;
      display: flex;
      align-items: baseline;
      gap: 0.55rem;
      color: #f7f3ec;
      font-family: var(--font-sans);
      font-size: 0.85rem;
      letter-spacing: 0.005em;
      background: rgba(28, 26, 23, 0.55);
      -webkit-backdrop-filter: blur(8px);
      backdrop-filter: blur(8px);
      padding: 0.55rem 0.75rem;
      border-radius: var(--radius-xs);
    }

    .grid__num {
      font-family: var(--font-serif);
      letter-spacing: 0.05em;
      color: var(--c-accent-soft);
    }

    .muted {
      text-align: center;
      color: var(--c-muted);
    }
  `,
})
export class GalleryComponent implements OnInit {
  private readonly gallery = inject(GalleryService);
  private readonly seo = inject(SeoService);

  protected readonly filters: Array<{ id: Filter; label: string }> = [
    { id: 'todos', label: 'Todos' },
    { id: 'lugar', label: 'El lugar' },
    { id: 'platos', label: 'Platos' },
    { id: 'eventos', label: 'Eventos' },
  ];

  protected readonly active = signal<Filter>('todos');

  private readonly imagesSignal = toSignal(this.gallery.list(), {
    initialValue: [] as GalleryImage[],
  });

  protected readonly visible = computed(() => {
    const cat = this.active();
    const list = this.imagesSignal();
    return cat === 'todos' ? list : list.filter((img) => img.category === cat);
  });

  ngOnInit(): void {
    this.seo.update({
      title: 'Galería',
      description: 'Galería de fotos del recreo, los platos y eventos en Recreo Ponceca.',
      url: 'https://recreoponceca.pe/galeria',
    });
  }

  setFilter(id: Filter): void {
    this.active.set(id);
  }

  /**
   * Returns a column span hint so the gallery feels like a curated
   * mosaic instead of a uniform grid. The pattern repeats every six
   * tiles to balance asymmetric and standard cells.
   */
  span(index: number): 'wide' | 'narrow' | null {
    const mod = index % 6;
    if (mod === 0 || mod === 4) return 'wide';
    if (mod === 1 || mod === 5) return 'narrow';
    return null;
  }
}
