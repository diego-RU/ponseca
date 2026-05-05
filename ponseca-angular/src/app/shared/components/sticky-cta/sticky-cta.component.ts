import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { APP_CONFIG } from '../../../core/config/app-config';
import { NotificationService } from '../../../core/services/notification.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-sticky-cta',
  standalone: true,
  imports: [RouterLink, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sticky-cta.component.html',
  styleUrl: './sticky-cta.component.css',
})
export class StickyCtaComponent {
  protected readonly config = APP_CONFIG;
  private readonly notify = inject(NotificationService);
  private readonly router = inject(Router);

  protected get phoneHref(): string {
    return this.notify.callPhone();
  }

  protected get whatsappHref(): string {
    return this.notify.whatsappLink(`Hola Recreo Ponceca, me gustaría reservar una mesa.`);
  }

  protected get hideOnAdmin(): boolean {
    return this.router.url.startsWith('/admin');
  }
}
