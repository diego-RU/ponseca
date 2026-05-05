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
import { SolCurrencyPipe } from '../../shared/pipes/sol-currency.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AsyncPipe, NgClass, RouterLink, SolCurrencyPipe],
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

  protected readonly amenities = [
    { icon: '🌳', label: 'Áreas verdes y mirador' },
    { icon: '🛝', label: 'Zona infantil segura' },
    { icon: '🚗', label: 'Estacionamiento amplio' },
    { icon: '🍽️', label: 'Cocina regional al horno y a la brasa' },
    { icon: '🎉', label: 'Eventos y reuniones familiares' },
    { icon: '📶', label: 'WiFi y atención cordial' },
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
