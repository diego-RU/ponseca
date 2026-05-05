import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { APP_CONFIG } from '../../../core/config/app-config';
import { NotificationService } from '../../../core/services/notification.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  protected readonly config = APP_CONFIG;
  protected readonly year = new Date().getFullYear();
  private readonly notify = inject(NotificationService);

  protected get whatsappLink(): string {
    return this.notify.whatsappLink('Hola, quisiera más información sobre Recreo Ponceca.');
  }

  protected get phoneLink(): string {
    return this.notify.callPhone();
  }
}
