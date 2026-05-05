import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import { APP_CONFIG } from '../../../core/config/app-config';
import { AuthService } from '../../../core/services/auth.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  protected readonly config = APP_CONFIG;
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly menuOpen = signal(false);
  protected readonly currentUser = computed(() => this.auth.user());

  protected readonly navItems = [
    { label: 'Inicio', path: '/' },
    { label: 'Nosotros', path: '/nosotros' },
    { label: 'Menú', path: '/menu' },
    { label: 'Galería', path: '/galeria' },
    { label: 'Reservas', path: '/reservas' },
    { label: 'Ubicación', path: '/ubicacion' },
    { label: 'Contacto', path: '/contacto' },
  ] as const;

  constructor() {
    this.router.events
      .pipe(filter((evt) => evt instanceof NavigationEnd))
      .subscribe(() => this.menuOpen.set(false));
  }

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}
