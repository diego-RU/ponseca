import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { Booking, BookingDraft, BookingStatus } from '../models/booking.model';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private readonly api = inject(ApiService);

  list(): Observable<Booking[]> {
    return this.api.getBookings();
  }

  create(draft: BookingDraft): Observable<Booking> {
    return this.api.createBooking(draft);
  }

  setStatus(id: string, status: BookingStatus): Observable<Booking> {
    return this.api.updateBookingStatus(id, status);
  }
}
