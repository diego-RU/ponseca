import { AsyncPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable, map } from 'rxjs';

import { APP_CONFIG } from '../../core/config/app-config';
import { MenuItem } from '../../core/models/menu-item.model';
import { Review } from '../../core/models/review.model';
import { MenuService } from '../../core/services/menu.service';
import { NotificationService } from '../../core/services/notification.service';
import { ReviewService } from '../../core/services/review.service';
import { SeoService } from '../../core/services/seo.service';
import { IconComponent, IconName } from '../../shared/components/icon/icon.component';
import { SolCurrencyPipe } from '../../shared/pipes/sol-currency.pipe';

interface Amenity {
  icon: IconName;
  label: string;
  description: string;
}

interface Highlight {
  number: string;
  label: string;
  caption: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AsyncPipe, NgClass, RouterLink, IconComponent, SolCurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  protected readonly config = APP_CONFIG;

  private readonly menuService = inject(MenuService);
  private readonly reviewService = inject(ReviewService);
  private readonly notify = inject(NotificationService);
  private readonly seo = inject(SeoService);

  protected readonly highlights$: Observable<MenuItem[]> = this.menuService
    .list()
    .pipe(map((items) => items.filter((m) => m.highlight).slice(0, 3)));

  protected readonly reviews$: Observable<Review[]> = this.reviewService
    .list()
    .pipe(map((rev) => rev.slice(0, 3)));

  protected readonly amenities: Amenity[] = [
    {
      icon: 'pin-mountain',
      label: 'Mirador y áreas verdes',
      description: 'Espacios al aire libre con vista al valle de Andahuaylas.',
    },
    {
      icon: 'utensils',
      label: 'Cocina regional al horno',
      description: 'Cuy, trucha, chairo y chicharrón con productos del valle.',
    },
    {
      icon: 'users',
      label: 'Eventos y reuniones',
      description: 'Reservamos zonas privadas para cumpleaños, bautizos y empresas.',
    },
    {
      icon: 'parking',
      label: 'Estacionamiento amplio',
      description: 'Llega en auto o combi: tenemos espacio dentro del recreo.',
    },
    {
      icon: 'leaf',
      label: 'Zona infantil segura',
      description: 'Juegos al aire libre supervisados desde el área de mesas.',
    },
    {
      icon: 'wifi',
      label: 'WiFi y atención cordial',
      description: 'Conectividad para visitas de paso, sin perder el descanso.',
    },
  ];

  protected readonly highlights: Highlight[] = [
    { number: '15', label: 'años', caption: 'cocinando con familia y vecinos.' },
    { number: '4.8', label: 'estrellas', caption: 'promedio en Google y TripAdvisor.' },
    { number: '180', label: 'aforo', caption: 'incluyendo terraza y zonas privadas.' },
  ];

  protected readonly stars = [1, 2, 3, 4, 5];

  ngOnInit(): void {
    this.seo.update({
      title: 'Recreo Ponceca · Restaurante campestre en Andahuaylas',
      description:
        'Sabor regional, áreas verdes y mirador en Andahuaylas. Reserva tu mesa o evento por WhatsApp.',
      url: 'https://recreoponceca.pe/',
      image: 'https://recreoponceca.pe/assets/og-image.jpg',
      type: 'restaurant.restaurant',
    });
  }

  protected get whatsappLink(): string {
    return this.notify.whatsappLink('Hola Recreo Ponceca, me gustaría reservar una mesa.');
  }

  protected get phoneLink(): string {
    return this.notify.callPhone();
  }

  protected ratingFraction(rating: number, star: number): 'full' | 'half' | 'empty' {
    if (rating >= star) return 'full';
    if (rating >= star - 0.5) return 'half';
    return 'empty';
  }
}
