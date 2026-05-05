import { Injectable } from '@angular/core';

/**
 * ImageService — placeholder for an image storage adapter (S3 / Cloudinary /
 * Bunny / etc.). Production deployments should swap this for a real upload
 * + processing pipeline (`/api/images` returning a CDN URL). For now it
 * simply turns a `File` into an object URL so the admin gallery can preview
 * locally selected images without a backend.
 */
@Injectable({ providedIn: 'root' })
export class ImageService {
  toObjectUrl(file: File): string {
    return URL.createObjectURL(file);
  }

  revoke(url: string): void {
    if (url.startsWith('blob:')) URL.revokeObjectURL(url);
  }
}
