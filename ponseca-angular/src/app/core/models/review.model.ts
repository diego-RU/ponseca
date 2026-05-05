export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  source: 'Google' | 'TripAdvisor' | 'Facebook' | 'Sitio';
  date: string; // ISO yyyy-mm-dd
  avatarInitial?: string;
}
