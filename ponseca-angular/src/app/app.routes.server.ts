import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * Server-side rendering strategy:
 *  - Public marketing pages are prerendered at build time so they ship as
 *    static HTML and are perfect for local SEO.
 *  - The admin area is rendered on demand on the server (`Server` mode) so
 *    auth-gated state is never baked into the bundle.
 */
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'nosotros', renderMode: RenderMode.Prerender },
  { path: 'menu', renderMode: RenderMode.Prerender },
  { path: 'galeria', renderMode: RenderMode.Prerender },
  { path: 'reservas', renderMode: RenderMode.Prerender },
  { path: 'reservas/exito', renderMode: RenderMode.Server },
  { path: 'ubicacion', renderMode: RenderMode.Prerender },
  { path: 'contacto', renderMode: RenderMode.Prerender },
  { path: 'admin/login', renderMode: RenderMode.Prerender },
  { path: 'admin', renderMode: RenderMode.Server },
  { path: 'admin/**', renderMode: RenderMode.Server },
  { path: '**', renderMode: RenderMode.Server },
];
