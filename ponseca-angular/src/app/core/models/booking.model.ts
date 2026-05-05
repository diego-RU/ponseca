export type BookingStatus = 'pendiente' | 'confirmada' | 'cancelada' | 'completada';

export interface Booking {
  id: string;
  name: string;
  phone: string;
  email?: string;
  date: string; // ISO yyyy-mm-dd
  time: string; // HH:mm
  pax: number;
  notes?: string;
  status: BookingStatus;
  createdAt: string; // ISO datetime
  source?: 'web' | 'phone' | 'walk-in';
}

export interface BookingDraft {
  name: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  pax: number;
  notes?: string;
}
