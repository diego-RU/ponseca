export interface GalleryImage {
  id: string;
  url: string;
  thumbUrl?: string;
  alt: string;
  category: 'lugar' | 'platos' | 'eventos';
}
