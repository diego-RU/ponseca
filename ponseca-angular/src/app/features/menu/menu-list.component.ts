import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Observable } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

import { MenuCategory, MenuItem } from '../../core/models/menu-item.model';
import { MenuService } from '../../core/services/menu.service';
import { SeoService } from '../../core/services/seo.service';
import { SolCurrencyPipe } from '../../shared/pipes/sol-currency.pipe';

interface CategoryFilter {
  id: 'todos' | MenuCategory;
  label: string;
}

@Component({
  selector: 'app-menu-list',
  standalone: true,
  imports: [NgClass, SolCurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './menu-list.component.html',
  styleUrl: './menu-list.component.css',
})
export class MenuListComponent implements OnInit {
  private readonly menuService = inject(MenuService);
  private readonly seo = inject(SeoService);

  protected readonly categories: CategoryFilter[] = [
    { id: 'todos', label: 'Todos' },
    { id: 'platos-principales', label: 'Platos principales' },
    { id: 'criollos', label: 'Criollos' },
    { id: 'sopas', label: 'Sopas' },
    { id: 'entradas', label: 'Entradas' },
    { id: 'bebidas', label: 'Bebidas' },
    { id: 'postres', label: 'Postres' },
  ];

  protected readonly activeCategory = signal<CategoryFilter['id']>('todos');

  private readonly items$: Observable<MenuItem[]> = this.menuService.list();
  private readonly itemsSignal = toSignal(this.items$, { initialValue: [] as MenuItem[] });

  protected readonly visibleItems = computed(() => {
    const cat = this.activeCategory();
    const items = this.itemsSignal();
    if (cat === 'todos') return items;
    return items.filter((m) => m.category === cat);
  });

  ngOnInit(): void {
    this.seo.update({
      title: 'Menú',
      description:
        'Conoce nuestros platos regionales: cuy al horno, trucha, chairo apurimeño, chicharrón y más, con precios actualizados.',
      url: 'https://recreoponceca.pe/menu',
    });
  }

  setCategory(id: CategoryFilter['id']): void {
    this.activeCategory.set(id);
  }

  trackById(_: number, item: MenuItem): string {
    return item.id;
  }

  /**
   * Builds a printable text version of the current menu and triggers a
   * download. Avoids extra dependencies (no jsPDF) and keeps the bundle
   * tiny while still satisfying the "descargar PDF" UX. Replace with a
   * server-rendered PDF when a backend is available.
   */
  downloadMenu(): void {
    const items = this.itemsSignal();
    if (!items.length) return;

    const grouped = new Map<string, MenuItem[]>();
    for (const item of items) {
      const arr = grouped.get(item.category) ?? [];
      arr.push(item);
      grouped.set(item.category, arr);
    }

    const lines: string[] = [
      'RECREO PONCECA · Carta',
      'Andahuaylas, Apurímac',
      '======================================',
      '',
    ];
    for (const [cat, list] of grouped) {
      lines.push(this.categoryLabel(cat).toUpperCase());
      lines.push('--------------------------------------');
      for (const item of list) {
        lines.push(`${item.name.padEnd(30, ' ')} S/ ${item.price.toFixed(2)}`);
        lines.push(`  ${item.description}`);
        lines.push('');
      }
    }
    lines.push('Reservas: +51 960 719 103 · WhatsApp');

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recreo-ponceca-menu.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

  protected categoryLabel(id: string): string {
    return this.categories.find((c) => c.id === id)?.label ?? id;
  }
}
