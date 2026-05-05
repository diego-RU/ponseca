import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

import { GalleryImage } from '../../../core/models/gallery-image.model';
import { GalleryService } from '../../../core/services/gallery.service';

@Component({
  selector: 'app-admin-gallery',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-header">
      <h1>Galería</h1>
      <p>Sube fotos del lugar, los platos o eventos.</p>
    </header>

    <form class="card editor" [formGroup]="form" (ngSubmit)="add()">
      <div class="form-grid">
        <div class="form-field">
          <label for="g-url">URL de la imagen</label>
          <input id="g-url" formControlName="url" type="url" required />
        </div>
        <div class="form-field">
          <label for="g-alt">Texto alternativo</label>
          <input id="g-alt" formControlName="alt" required />
        </div>
        <div class="form-field">
          <label for="g-cat">Categoría</label>
          <select id="g-cat" formControlName="category">
            <option value="lugar">El lugar</option>
            <option value="platos">Platos</option>
            <option value="eventos">Eventos</option>
          </select>
        </div>
      </div>
      <button type="submit" class="btn" [disabled]="form.invalid">Agregar</button>
      <p class="muted">
        En producción, conecta el endpoint <code>POST /api/images</code> a un almacenamiento como S3
        o Cloudinary y devuelve aquí la URL final.
      </p>
    </form>

    <div class="grid">
      @for (img of images(); track img.id) {
        <figure class="card item">
          <img [src]="img.url" [alt]="img.alt" loading="lazy" />
          <figcaption>
            <span>{{ img.alt }}</span>
            <button type="button" class="btn btn--sm btn--ghost" (click)="remove(img)">
              Eliminar
            </button>
          </figcaption>
        </figure>
      }
    </div>
  `,
  styles: `
    .page-header {
      margin-bottom: 1rem;
    }
    .editor {
      padding: 1.4rem;
      margin-bottom: 1.5rem;
    }

    .grid {
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    }

    .item img {
      aspect-ratio: 4 / 3;
      object-fit: cover;
      width: 100%;
    }

    figcaption {
      padding: 0.6rem 0.8rem;
      display: flex;
      gap: 0.5rem;
      align-items: center;
      justify-content: space-between;
      font-size: 0.85rem;
      color: var(--color-ink-soft);
    }

    .muted {
      color: var(--color-muted);
      font-size: 0.85rem;
      margin-top: 0.5rem;
    }

    code {
      background: rgba(31, 26, 23, 0.07);
      padding: 0 0.3rem;
      border-radius: 4px;
    }
  `,
})
export class AdminGalleryComponent {
  private readonly gallery = inject(GalleryService);
  private readonly fb = inject(FormBuilder);

  private readonly initial = toSignal(this.gallery.list(), { initialValue: [] as GalleryImage[] });
  private readonly listSignal = signal<GalleryImage[]>([]);
  protected readonly images = computed(() => this.listSignal());

  protected readonly form = this.fb.nonNullable.group({
    url: ['', [Validators.required]],
    alt: ['', [Validators.required, Validators.minLength(3)]],
    category: ['lugar' as GalleryImage['category'], Validators.required],
  });

  constructor() {
    queueMicrotask(() => this.listSignal.set(this.initial()));
  }

  add(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.gallery.add(this.form.getRawValue()).subscribe((created) => {
      this.listSignal.update((arr) => [...arr, created]);
      this.form.reset({ url: '', alt: '', category: 'lugar' });
    });
  }

  remove(img: GalleryImage): void {
    if (!confirm('¿Eliminar imagen?')) return;
    this.gallery.remove(img.id).subscribe(() => {
      this.listSignal.update((arr) => arr.filter((g) => g.id !== img.id));
    });
  }
}
