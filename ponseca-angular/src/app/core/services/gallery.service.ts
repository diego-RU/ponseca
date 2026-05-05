import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { GalleryImage } from '../models/gallery-image.model';

@Injectable({ providedIn: 'root' })
export class GalleryService {
  private readonly api = inject(ApiService);

  list(): Observable<GalleryImage[]> {
    return this.api.getGallery();
  }

  add(image: Omit<GalleryImage, 'id'>): Observable<GalleryImage> {
    return this.api.createGalleryImage(image);
  }

  remove(id: string): Observable<void> {
    return this.api.deleteGalleryImage(id);
  }
}
