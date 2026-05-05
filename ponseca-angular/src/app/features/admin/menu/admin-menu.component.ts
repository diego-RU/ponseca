import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

import { MenuCategory, MenuItem } from '../../../core/models/menu-item.model';
import { MenuService } from '../../../core/services/menu.service';
import { SolCurrencyPipe } from '../../../shared/pipes/sol-currency.pipe';

@Component({
  selector: 'app-admin-menu',
  standalone: true,
  imports: [ReactiveFormsModule, SolCurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-header">
      <div>
        <h1>Menú</h1>
        <p>Administra los platos disponibles en la carta.</p>
      </div>
      <button type="button" class="btn btn--sm" (click)="openNew()">+ Nuevo plato</button>
    </header>

    @if (editing()) {
      <form class="card editor" [formGroup]="form" (ngSubmit)="save()">
        <h2>{{ editingId() ? 'Editar plato' : 'Nuevo plato' }}</h2>
        <div class="form-grid">
          <div class="form-field">
            <label for="m-name">Nombre</label>
            <input id="m-name" formControlName="name" required />
          </div>
          <div class="form-field">
            <label for="m-price">Precio</label>
            <input id="m-price" type="number" step="0.5" min="0" formControlName="price" required />
          </div>
          <div class="form-field">
            <label for="m-category">Categoría</label>
            <select id="m-category" formControlName="category">
              <option value="platos-principales">Plato principal</option>
              <option value="criollos">Criollo</option>
              <option value="sopas">Sopa</option>
              <option value="entradas">Entrada</option>
              <option value="bebidas">Bebida</option>
              <option value="postres">Postre</option>
            </select>
          </div>
          <div class="form-field">
            <label for="m-image">URL imagen</label>
            <input id="m-image" formControlName="imageUrl" type="url" />
          </div>
        </div>
        <div class="form-field">
          <label for="m-description">Descripción</label>
          <textarea id="m-description" rows="3" formControlName="description"></textarea>
        </div>
        <div class="row">
          <label class="checkbox">
            <input type="checkbox" formControlName="available" /> Disponible
          </label>
          <label class="checkbox">
            <input type="checkbox" formControlName="highlight" /> Destacado
          </label>
          <label class="checkbox">
            <input type="checkbox" formControlName="spicy" /> Picante
          </label>
        </div>
        <div class="actions">
          <button type="submit" class="btn" [disabled]="form.invalid">Guardar</button>
          <button type="button" class="btn btn--ghost" (click)="cancel()">Cancelar</button>
        </div>
      </form>
    }

    <div class="grid">
      @for (item of items(); track item.id) {
        <article class="card item">
          <img [src]="item.imageUrl" [alt]="item.name" loading="lazy" />
          <div class="item__body">
            <header>
              <h3>{{ item.name }}</h3>
              <strong>{{ item.price | sol }}</strong>
            </header>
            <p>{{ item.description }}</p>
            <small class="muted">
              {{ item.category }} · {{ item.available ? 'disponible' : 'agotado' }}
              @if (item.highlight) {
                · destacado
              }
              @if (item.spicy) {
                · picante
              }
            </small>
            <div class="actions">
              <button type="button" class="btn btn--sm btn--ghost" (click)="edit(item)">
                Editar
              </button>
              <button type="button" class="btn btn--sm" (click)="remove(item)">Eliminar</button>
            </div>
          </div>
        </article>
      }
    </div>
  `,
  styles: `
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }

    .editor {
      padding: 1.4rem;
      margin-bottom: 1.5rem;
    }

    .row {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      margin-block: 0.5rem;
    }

    .checkbox {
      display: inline-flex;
      gap: 0.4rem;
      align-items: center;
    }

    .actions {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-top: 0.5rem;
    }

    .grid {
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    }

    .item img {
      aspect-ratio: 4 / 3;
      object-fit: cover;
      width: 100%;
    }

    .item__body {
      padding: 0.9rem 1rem 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }

    .item__body header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 0.5rem;
    }

    .item__body h3 {
      margin: 0;
      font-size: 1.05rem;
    }

    .item__body strong {
      color: var(--color-primary-dark);
    }

    .muted {
      color: var(--color-muted);
      font-size: 0.85rem;
    }
  `,
})
export class AdminMenuComponent {
  private readonly menu = inject(MenuService);
  private readonly fb = inject(FormBuilder);

  private readonly initial = toSignal(this.menu.list(), { initialValue: [] as MenuItem[] });
  private readonly listSignal = signal<MenuItem[]>([]);
  protected readonly items = computed(() => this.listSignal());

  protected readonly editing = signal(false);
  protected readonly editingId = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    category: ['platos-principales' as MenuCategory, Validators.required],
    imageUrl: [
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=70',
    ],
    available: [true],
    highlight: [false],
    spicy: [false],
  });

  constructor() {
    queueMicrotask(() => this.listSignal.set(this.initial()));
  }

  openNew(): void {
    this.editingId.set(null);
    this.form.reset({
      name: '',
      description: '',
      price: 0,
      category: 'platos-principales',
      imageUrl:
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=70',
      available: true,
      highlight: false,
      spicy: false,
    });
    this.editing.set(true);
  }

  edit(item: MenuItem): void {
    this.editingId.set(item.id);
    this.form.reset({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      imageUrl: item.imageUrl,
      available: item.available,
      highlight: !!item.highlight,
      spicy: !!item.spicy,
    });
    this.editing.set(true);
  }

  cancel(): void {
    this.editing.set(false);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    const id = this.editingId();
    if (id) {
      this.menu.update(id, value).subscribe((updated) => {
        this.listSignal.update((arr) => arr.map((m) => (m.id === id ? updated : m)));
        this.editing.set(false);
      });
    } else {
      this.menu.create(value).subscribe((created) => {
        this.listSignal.update((arr) => [...arr, created]);
        this.editing.set(false);
      });
    }
  }

  remove(item: MenuItem): void {
    if (!confirm(`¿Eliminar ${item.name}?`)) return;
    this.menu.remove(item.id).subscribe(() => {
      this.listSignal.update((arr) => arr.filter((m) => m.id !== item.id));
    });
  }
}
