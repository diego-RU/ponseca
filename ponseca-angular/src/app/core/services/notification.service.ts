import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Observable, of } from 'rxjs';

import { ApiService } from './api.service';
import { APP_CONFIG } from '../config/app-config';

/**
 * Click-to-Chat WhatsApp helper plus an optional server-side notify hook.
 *
 * - `whatsappLink(message)` builds a `https://wa.me/...` URL using the
 *   business number defined in `APP_CONFIG`.
 * - `openWhatsapp(message)` opens the link in a new tab.
 * - `notifyWhatsapp(phone, message)` calls the (optional) server endpoint
 *   `/api/notify/whatsapp` so the back office can push a confirmation
 *   message via the WhatsApp Business API.
 */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly api = inject(ApiService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly doc = inject(DOCUMENT);

  whatsappLink(message: string, phone?: string): string {
    const target = (phone ?? APP_CONFIG.business.phoneWhatsapp).replace(/\D/g, '');
    return `https://wa.me/${target}?text=${encodeURIComponent(message)}`;
  }

  openWhatsapp(message: string, phone?: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const win = this.doc.defaultView;
    win?.open(this.whatsappLink(message, phone), '_blank', 'noopener');
  }

  callPhone(phone?: string): string {
    const target = (phone ?? APP_CONFIG.business.phone).replace(/\s+/g, '');
    return `tel:${target}`;
  }

  /** Optional: kick the server endpoint that pushes a WhatsApp message. */
  notifyWhatsapp(phone: string, message: string): Observable<{ ok: boolean }> {
    if (!phone) return of({ ok: false });
    return this.api.notifyWhatsapp(phone, message);
  }
}
