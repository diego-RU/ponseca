import { AsyncPipe, NgClass } from '@angular/common';
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
    <section class="section">
      <div class="container">
        <header class="section__header">
          <span class="section__eyebrow">Galería</span>
          <h1>El recreo en imágenes</h1>
          <p>
            Áreas verdes, mirador, platos y celebraciones. ¿Más fotos? Síguenos en redes o visítanos
            para vivir la experiencia.
          </p>
        </header>

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
          @for (img of visible(); track img.id) {
            <figure class="grid__item">
              <img
                [src]="img.url"
                [alt]="img.alt"
                loading="lazy"
                decoding="async"
                width="800"
                height="600"
              />
              <figcaption>{{ img.alt }}</figcaption>
            </figure>
          } @empty {
            <p class="muted">Aún no hay fotos en esta categoría.</p>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .filters {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      justify-content: center;
      margin-bottom: 1.5rem;
    }

    .filter {
      background: #fff;
      border: 1px solid var(--color-line);
      color: var(--color-ink-soft);
      padding: 0.45rem 1rem;
      border-radius: var(--radius-pill);
      font-weight: 500;
      font-size: 0.9rem;
    }

    .filter.is-active {
      background: var(--color-primary);
      color: #fff;
      border-color: var(--color-primary);
    }

    .grid {
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    }

    .grid__item {
      margin: 0;
      border-radius: var(--radius-md);
      overflow: hidden;
      background: var(--color-sand);
      box-shadow: var(--shadow-sm);
    }

    .grid__item img {
      width: 100%;
      aspect-ratio: 4 / 3;
      object-fit: cover;
      display: block;
      transition: transform 0.4s ease;
    }

    .grid__item:hover img {
      transform: scale(1.03);
    }

    .grid__item figcaption {
      padding: 0.6rem 0.8rem;
      font-size: 0.85rem;
      color: var(--color-ink-soft);
    }

    .muted {
      text-align: center;
      color: var(--color-muted);
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
}
